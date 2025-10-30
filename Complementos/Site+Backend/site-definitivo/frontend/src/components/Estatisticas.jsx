import { useEffect, useMemo, useRef, useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:3001";

function Estatisticas() {
  const [latest, setLatest] = useState({ t: null, h: null, p: null, s: null });
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);

  // ---------- integração: fetch inicial + WebSocket ----------
  useEffect(() => {
    // fetch inicial
    fetch(`${API}/api/metrics/latest`)
      .then((r) => r.json())
      .then((data) => setLatest(data))
      .catch(() => { /* silencioso */ });

    // websocket ao vivo
    const wsUrl = `${API.replace("http", "ws")}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === "telemetry" && msg.latest) setLatest(msg.latest);
      } catch { /* ignore */ }
    };

    return () => ws.close();
  }, []);

  // ---------- derivados e previsão ----------
  const now = Date.now();
  const t = latest.t?.value ?? null; // °C
  const h = latest.h?.value ?? null; // %
  const p = latest.p?.value ?? null; // % (luminosidade)

  const fresh = useMemo(() => {
    const times = [latest.t?.ts, latest.h?.ts, latest.p?.ts].filter(Boolean);
    if (!times.length) return false;
    const newest = Math.max(...times);
    return now - newest < 10000; // 10s
  }, [latest, now]);

  const forecast = useMemo(() => computeForecast(t, h, p), [t, h, p]);

  return (
    <main className="bg-gray-900 mx-auto p-4 md:p-6 text-gray-200">
      {/* Título */}
      <header className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500">
            Estatísticas
          </h1>
          <p className="text-sm text-gray-400">Painel visual</p>
        </div>

        {/* Status de dados (mantido no mesmo lugar/estilo) */}
        <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-purple-700/60 px-3 py-1 text-xs text-purple-300">
          <span className={`inline-block h-2 w-2 rounded-full ${fresh && connected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400 animate-pulse"}`} />
          {fresh && connected ? "Coleta ao vivo" : "Aguardando dados"}
        </span>
      </header>

      {/* Card de destaque: Jogo atual */}
      <section className="mb-6">
        <div className="relative overflow-hidden rounded-2xl border border-purple-700/40 bg-gray-900/70 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-5 md:p-6">
            {/* Times e metadata */}
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 text-[10px] uppercase tracking-wide rounded bg-purple-600/20 text-purple-300 border border-purple-700/50">Jogo em destaque</span>
                <span className="px-2 py-1 text-[10px] uppercase tracking-wide rounded bg-indigo-600/20 text-indigo-300 border border-indigo-700/50">Coleta ao vivo</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold">Passa a Bola FC × União da Vila</h2>
              <p className="text-gray-400 mt-1">Estádio Municipal — Sáb, 14:30</p>
            </div>

            {/* Placar/Status visual */}
            <div className="md:col-span-2 flex items-center md:justify-end">
              <div className="w-full md:w-auto">
                <div className="flex items-center justify-between md:justify-center gap-6 bg-gray-800/60 border border-gray-700 rounded-xl px-5 py-3">
                  <div className="text-center">
                    <div className="text-gray-400 text-xs">Casa</div>
                    <div className="text-3xl font-bold">PAF</div>
                  </div>
                  <div className="text-2xl font-semibold text-gray-400">vs</div>
                  <div className="text-center">
                    <div className="text-gray-400 text-xs">Visitante</div>
                    <div className="text-3xl font-bold">UDV</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-400">
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400"/> Luz ambiente</span>
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400"/> Temperatura</span>
                  <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Umidade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progresso de coleta (decorativa) */}
          <div className="h-1 w-full bg-gray-800">
            <div className="h-full w-1/3 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600" />
          </div>
        </div>
      </section>

      {/* Grid das métricas principais */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Temperatura */}
        <MetricCard
          title="Temperatura"
          value={fmt(t, "°C")}
          subtitle="Ambiente"
          accent="bg-cyan-500"
          ring="ring-cyan-500/20"
          barClass="bg-cyan-500"
          chartLabel="Últimas 2h"
        />

        {/* Umidade */}
        <MetricCard
          title="Umidade"
          value={fmt(h, "%")}
          subtitle="Relativa"
          accent="bg-emerald-500"
          ring="ring-emerald-500/20"
          barClass="bg-emerald-500"
          chartLabel="Últimas 2h"
        />

        {/* Luminosidade */}
        <MetricCard
          title="Luminosidade"
          value={fmt(p, "%")}
          subtitle="Lux"
          accent="bg-amber-400"
          ring="ring-amber-400/20"
          barClass="bg-amber-400"
          chartLabel="Últimas 2h"
        />
      </section>

      {/* Previsão & Recomendações */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-purple-700/40 bg-gray-900/70 shadow-lg p-5">
          <h3 className="text-lg font-semibold mb-1">Previsão baseada em sensores</h3>
          <p className="text-gray-400 mb-4 text-sm">Cenário estimado usando temperatura, umidade e luminosidade do campo.</p>

          {/* Badges dinâmicas */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {forecast.badges.map((b) => (
              <Badge key={b.text} color={b.color} text={b.text} />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ForecastTile label="Prob. de Chuva" value={forecast.rainProbStr} hint="Baseada na umidade e luz" />
            <ForecastTile label="Sensaç. Térmica" value={forecast.thermalStr} hint="Aprox.: Temp + umidade" />
            <ForecastTile label="Índice de Luminosidade" value={forecast.luxIndexStr} hint="Normalizado (0–100)" />
          </div>

          {/* Sparkline decorativo*/}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2 text-xs text-gray-400">
              <span>Leituras das últimas 2 horas</span>
              <span>{fresh && connected ? "Atualização ao vivo" : "Aguardando atualização"}</span>
            </div>
            <div className="h-24 w-full rounded-lg border border-gray-800 bg-gray-900/60 p-2">
              <svg viewBox="0 0 400 80" className="h-full w-full">
                <defs>
                  <linearGradient id="g1" x1="0" x2="1">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>
                <path d="M0 60 L40 50 L80 55 L120 30 L160 45 L200 35 L240 20 L280 28 L320 22 L360 32 L400 18" fill="none" stroke="url(#g1)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Recomendações (loja)*/}
        <div className="rounded-2xl border border-purple-700/40 bg-gray-900/70 shadow-lg p-5">
          <h3 className="text-lg font-semibold mb-1">Recomendações de Jogo</h3>
          <p className="text-gray-400 mb-4 text-sm">Sugestões de roupa de acordo com as condições previstas.</p>

          <ul className="space-y-3">
            {forecast.suggestions.map((sug) => (
              <li key={sug.title} className="flex items-center justify-between rounded-xl border border-gray-800 bg-gray-800/40 p-3">
                <div>
                  <div className="text-sm font-medium">{sug.title}</div>
                  <div className="text-xs text-gray-400">{sug.desc}</div>
                </div>
                <span className="text-xs text-purple-300">Ver na <a href="/loja" className="underline hover:text-purple-200">loja</a></span>
              </li>
            ))}
          </ul>

          <a
            href="/loja"
            className="mt-4 inline-flex items-center justify-center w-full rounded-full bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 text-white px-4 py-2 text-sm font-medium shadow-lg shadow-purple-500/30 hover:brightness-110"
          >
            Ver catálogo completo
          </a>
        </div>
      </section>
    </main>
  );
}

/* ---------------------- Helpers de previsão ---------------------- */
function computeForecast(t, h, p) {
  // fallback quando não há dados
  if (t == null || h == null || p == null) {
    return {
      rainProbStr: "--%",
      thermalStr: "--°C",
      luxIndexStr: "--/100",
      badges: [
        { text: "Aguardando dados", color: "from-slate-500 to-gray-500" },
      ],
      suggestions: [
        { title: "Camisa Dry-Fit", desc: "Respirável para calor" },
        { title: "Corta-vento leve", desc: "Bom para garoa" },
        { title: "Agasalho térmico", desc: "Opção para frio" },
      ],
    };
  }

  // Probabilidade de chuva (heurística simples):
  // umidade alta + baixa luminosidade => aumenta probabilidade
  // Escala aproximada: 0–100
  let rainProb = 0;
  if (h >= 90 && p <= 25) rainProb = 85;
  else if (h >= 80 && p <= 35) rainProb = 65;
  else if (h >= 70 && p <= 45) rainProb = 45;
  else if (h >= 60 && p <= 55) rainProb = 25;
  else rainProb = 10;

  // Sensação térmica aproximada (considerando umidade)
  let thermal = Number(t);
  if (t >= 26 && h >= 60) thermal += 1.5;
  if (t <= 18 && h >= 70) thermal -= 0.5;

  // Índice de luminosidade (0–100) — aqui usamos p diretamente
  const luxIndex = clamp(Math.round(p), 0, 100);

  // Badges de cenário
  const badges = [];
  // chuva / normal
  if (rainProb >= 70) badges.push({ text: "Alta chance de chuva", color: "from-sky-600 to-cyan-500" });
  else if (rainProb >= 40) badges.push({ text: "Possível garoa", color: "from-sky-500 to-cyan-400" });
  else badges.push({ text: "Clima normal", color: "from-emerald-500 to-teal-400" });

  // temperatura
  if (thermal >= 30) badges.push({ text: "Calor", color: "from-yellow-500 to-amber-400" });
  else if (thermal <= 17) badges.push({ text: "Frio", color: "from-indigo-500 to-blue-400" });
  else badges.push({ text: "Agradável", color: "from-lime-500 to-green-400" });

  // Recomendações de vestuário
  const suggestions = [];
  if (rainProb >= 60) {
    suggestions.push({ title: "Corta-vento leve", desc: "Protege de garoa e vento" });
    suggestions.push({ title: "Meia extra", desc: "Evita desconforto em campo úmido" });
  }
  if (thermal >= 29) {
    suggestions.push({ title: "Camisa Dry-Fit", desc: "Melhor respirabilidade no calor" });
    suggestions.push({ title: "Boné/Visor", desc: "Ajuda com luminosidade alta" });
  } else if (thermal <= 18) {
    suggestions.push({ title: "Agasalho térmico", desc: "Mantém aquecimento no pré-jogo" });
    suggestions.push({ title: "Camada base", desc: "Conforto em frio úmido" });
  }
  // fallback mínimo
  if (!suggestions.length) {
    suggestions.push({ title: "Camisa Dry-Fit", desc: "Respirável para clima ameno" });
    suggestions.push({ title: "Corta-vento leve", desc: "Útil se ventar" });
  }

  return {
    rainProbStr: `${Math.round(rainProb)}%`,
    thermalStr: `${round1(thermal)}°C`,
    luxIndexStr: `${luxIndex}/100`,
    badges,
    suggestions,
  };
}

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
function round1(x) { return Math.round(x * 10) / 10; }
function fmt(v, suffix) { return (v == null ? "--" : `${round1(Number(v))} ${suffix}`); }

/* ---------------------- Componentes de UI ---------------------- */
function MetricCard({ title, value, subtitle, accent, ring, barClass, chartLabel }) {
  return (
    <div className={`rounded-2xl border border-purple-700/30 bg-gray-900/70 shadow-lg p-5 ring-1 ${ring}`}>
      <div className="flex items-center justify-between mb-1">
        <h4 className="text-lg font-semibold">{title}</h4>
        <span className={`h-2 w-2 rounded-full ${accent}`} />
      </div>
      <p className="text-sm text-gray-400 mb-4">{subtitle}</p>

      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold leading-none">{value}</div>
        <div className="text-xs text-gray-400 mb-1">{chartLabel}</div>
      </div>

      {/* barra decorativa */}
      <div className="mt-4 h-2 w-full rounded bg-gray-800">
        <div className={`h-full w-1/3 ${barClass} rounded`} />
      </div>

      {/* mini gráfico decorativo */}
      <div className="mt-3 h-14 w-full rounded border border-gray-800 bg-gray-900/60 p-2">
        <svg viewBox="0 0 200 40" className="h-full w-full">
          <defs>
            <linearGradient id="g2" x1="0" x2="1">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <path d="M0 28 L20 24 L40 26 L60 18 L80 22 L100 16 L120 10 L140 14 L160 12 L180 15 L200 9" fill="none" stroke="url(#g2)" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

function Badge({ text, color }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-gradient-to-r ${color} px-3 py-1 text-xs text-white shadow-sm`}>{text}</span>
  );
}

function ForecastTile({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-800/40 p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-[11px] text-gray-500 mt-1">{hint}</div>
    </div>
  );
}
export default Estatisticas;