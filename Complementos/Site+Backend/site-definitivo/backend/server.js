require("dotenv").config(); // carrega o .env

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

/* dependências para MQTT e WebSocket ==== */
const mqtt = require("mqtt");
const { WebSocketServer } = require("ws");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// Usuários de exemplo (login)
const usuarios = [
  { email: "teste@teste.com", senha: "1234" },
  { email: "arthur@email.com", senha: "senha123" },
];

/* =======================================================================
   MQTT (consome tópicos do ESP32) + buffer em memória
   -----------------------------------------------------------------------
   - Assina os tópicos do seu firmware:
       /TEF/device001/attrs      (s|on / s|off)
       /TEF/device001/attrs/t    (temperatura)
       /TEF/device001/attrs/h    (umidade)
       /TEF/device001/attrs/p    (luminosidade)
   - Guarda últimos valores e um histórico curto em memória
   - Expõe REST e WS para o frontend
   ======================================================================= */

const {
  MQTT_HOST = "localhost",
  MQTT_PORT = "1883",
  MQTT_USERNAME,
  MQTT_PASSWORD,
  MQTT_TOPIC_ATTRS = "/TEF/device001/attrs",
  MQTT_TOPIC_T = "/TEF/device001/attrs/t",
  MQTT_TOPIC_H = "/TEF/device001/attrs/h",
  MQTT_TOPIC_P = "/TEF/device001/attrs/p",
  MQTT_TOPIC_CMD = "/TEF/device001/cmd",
} = process.env;

const mqttUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`;
const mqttOpts = {
  username: MQTT_USERNAME || undefined,
  password: MQTT_PASSWORD || undefined,
};

// conecta no broker
const mqttClient = mqtt.connect(mqttUrl, mqttOpts);

mqttClient.on("connect", () => {
  console.log("[MQTT] Conectado em", mqttUrl);
  [MQTT_TOPIC_ATTRS, MQTT_TOPIC_T, MQTT_TOPIC_H, MQTT_TOPIC_P].forEach((t) => {
    mqttClient.subscribe(t, { qos: 0 }, (err) => {
      if (err) console.error("[MQTT] Erro ao inscrever:", t, err.message);
      else console.log("[MQTT] Subscribed:", t);
    });
  });
});

mqttClient.on("error", (e) => {
  console.error("[MQTT] Erro:", e.message);
});

// buffer em memória
const ringSize = 1800; // ~30min se chegar 1 msg/s (ajuste à vontade)
const history = { t: [], h: [], p: [] }; // arrays de { ts, value }
let latest = { t: null, h: null, p: null, s: null };

function pushHistory(key, value) {
  const ts = Date.now();
  const arr = history[key];
  arr.push({ ts, value });
  if (arr.length > ringSize) arr.shift();
  latest[key] = { ts, value };
}

mqttClient.on("message", (topic, payloadBuf) => {
  const payload = payloadBuf.toString().trim();
  try {
    if (topic === MQTT_TOPIC_T) {
      pushHistory("t", Number(payload));
    } else if (topic === MQTT_TOPIC_H) {
      pushHistory("h", Number(payload));
    } else if (topic === MQTT_TOPIC_P) {
      pushHistory("p", Number(payload));
    } else if (topic === MQTT_TOPIC_ATTRS) {
      // s|on / s|off
      latest.s = { ts: Date.now(), value: payload };
    }

    // envia para todos os clientes WebSocket conectados
    const msg = JSON.stringify({ type: "telemetry", topic, payload, latest });
    if (global.wss) {
      global.wss.clients.forEach((ws) => {
        if (ws.readyState === 1) ws.send(msg);
      });
    }
  } catch (e) {
    console.error("[MQTT] Parse error:", topic, payload, e.message);
  }
});

/* ===============================
   API de Login
   =============================== */
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ erro: "E-mail inválido." });
  }

  if (!senha || senha.length < 4) {
    return res.status(400).json({ erro: "A senha deve ter pelo menos 4 caracteres." });
  }

  const usuario = usuarios.find((u) => u.email === email && u.senha === senha);

  if (!usuario) {
    return res.status(401).json({ erro: "E-mail ou senha incorretos." });
  }

  return res.status(200).json({
    sucesso: "Login realizado com sucesso!",
    usuario: { email: usuario.email },
  });
});

/* ===============================
   API de Notícias (com NewsAPI)
   =============================== */
app.get("/api/noticias", async (req, res) => {
  try {
    const resposta = await fetch(
      `https://newsapi.org/v2/everything?q=futebol%20feminino&language=pt&sortBy=publishedAt&apiKey=${process.env.NEWS_API_KEY}`
    );

    const data = await resposta.json();

    if (!data.articles) {
      return res.status(500).json({ erro: "Não foi possível carregar notícias." });
    }

    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar notícias:", error);
    res.status(500).json({ erro: "Erro ao buscar notícias." });
  }
});

/* ===============================
   API de Contato (receber mensagem)
   =============================== */
app.post("/contato", (req, res) => {
  const { nome, email, mensagem } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ erro: "E-mail inválido." });
  }
  if (!nome || !email || !mensagem) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
  }

  // Debugger
  console.log("Mensagem recebida:", { nome, email, mensagem });

  res.status(200).json({ sucesso: "Mensagem enviada com sucesso!" });
});

/* ===========================================================
   NOVO — REST para a Dashboard
   -----------------------------------------------------------
   - /api/metrics/latest: últimos valores (t, h, p, s)
   - /api/metrics/history/:key: histórico curto ('t'|'h'|'p')
   - /api/cmd: envia comando para o device (on/off)
   =========================================================== */

app.get("/api/metrics/latest", (_req, res) => {
  res.json(latest);
});

app.get("/api/metrics/history/:key", (req, res) => {
  const { key } = req.params; // 't' | 'h' | 'p'
  if (!["t", "h", "p"].includes(key)) {
    return res.status(400).json({ error: "key inválida. Use t, h ou p." });
  }
  res.json(history[key]);
});

app.post("/api/cmd", (req, res) => {
  const { action } = req.body; // 'on' | 'off'
  if (!["on", "off"].includes(action)) {
    return res.status(400).json({ error: "action inválida. Use on ou off." });
  }
  const deviceId = "device001";
  const cmd = `${deviceId}@${action}|`;
  mqttClient.publish(MQTT_TOPIC_CMD, cmd);
  res.json({ ok: true });
});

/* ===============================
   Subir servidor + WebSocket
   =============================== */
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

// NOVO: servidor WebSocket na mesma porta HTTP
const wss = new WebSocketServer({ server, path: "/ws" });
global.wss = wss;

wss.on("connection", (ws) => {
  // envia o snapshot inicial
  ws.send(JSON.stringify({ type: "hello", latest }));
});
