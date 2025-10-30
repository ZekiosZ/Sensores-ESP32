import { useState } from "react";

function Contato() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [feedback, setFeedback] = useState("");
  const [erro, setErro] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validação simples no frontend
    if (!nome.trim()) {
      setErro(true);
      setFeedback("Por favor, insira seu nome.");
      return;
    }
    if (!email || !email.includes("@")) {
      setErro(true);
      setFeedback("Por favor, insira um e-mail válido.");
      return;
    }
    if (!mensagem.trim()) {
      setErro(true);
      setFeedback("Por favor, escreva uma mensagem.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/contato", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, mensagem }),
      });

      const resultado = await res.json();

      if (res.ok && resultado.sucesso) {
        setErro(false);
        setFeedback(resultado.sucesso || "Mensagem enviada com sucesso!");
        setNome("");
        setEmail("");
        setMensagem("");
      } else {
        setErro(true);
        setFeedback(resultado.erro || "Erro ao enviar mensagem.");
      }
    } catch (err) {
      setErro(true);
      setFeedback("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="bg-gray-800 flex flex-col items-center justify-center py-16 px-4 text-white">
      <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">Contato</h2>
      <p className="max-w-2xl text-lg mb-8 text-center drop-shadow-md">
        Tem dúvidas, sugestões ou deseja falar com nossa equipe?  
        Preencha o formulário abaixo ou envie um e-mail diretamente para:
        <span className="text-purple-400 font-semibold">
          {" "}
          pixelforge603@gmail.com
        </span>
      </p>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-gray-900/70 p-8 rounded-2xl shadow-lg space-y-4"
        noValidate
      >
        <div>
          <label className="block text-left mb-2 font-semibold">Nome</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-left mb-2 font-semibold">E-mail</label>
          <input
            type="email"
            placeholder="seuemail@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-left mb-2 font-semibold">Mensagem</label>
          <textarea
            placeholder="Escreva sua mensagem..."
            rows="4"
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-lg font-bold shadow-lg"
        >
          Enviar Mensagem
        </button>
      </form>

      {feedback && (
        <p
          className={`mt-4 text-center font-medium ${
            erro ? "text-red-400" : "text-green-400"
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}

export default Contato;