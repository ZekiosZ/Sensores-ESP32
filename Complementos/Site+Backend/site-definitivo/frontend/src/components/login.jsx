import { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false); // para diferenciar sucesso/erro

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const resultado = await res.json();

      if (res.ok && resultado.sucesso) {
        // salva token no localStorage (se o backend enviar)
        if (resultado.token) {
          localStorage.setItem("token", resultado.token);
        }
        setErro(false);
        setMensagem(resultado.sucesso);
      } else {
        setErro(true);
        setMensagem(resultado.erro || "Erro no login.");
      }
    } catch (err) {
      setErro(true);
      setMensagem("Erro ao conectar com o servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-4">
      <div className="bg-gray-800 shadow-xl rounded-2xl p-8 max-w-md w-full border border-purple-700">
        <h2 className="text-3xl font-bold text-center text-white mb-2">
          Entrar na sua conta
        </h2>
        <p className="text-center text-gray-400 mb-6">
          Acesse sua conta para acompanhar o futebol feminino
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <input
            type="email"
            placeholder="Seu Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <input
            type="password"
            placeholder="Sua Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-900 border border-gray-600 text-white focus:ring-2 focus:ring-purple-500 outline-none"
          />

          <div className="flex justify-between items-center text-sm">
            <a href="#" className="text-purple-400 hover:underline">
              Esqueceu sua senha?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg font-semibold transition transform hover:scale-105"
          >
            Entrar
          </button>
        </form>

        {mensagem && (
          <p
            className={`mt-4 text-center font-medium ${
              erro ? "text-red-400" : "text-green-400"
            }`}
          >
            {mensagem}
          </p>
        )}

        <p className="mt-6 text-center text-gray-400">
          Não tem uma conta?{" "}
          <a href="#" className="text-purple-400 font-semibold hover:underline">
            Cadastre-se
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
