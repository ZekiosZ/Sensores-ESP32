export default function Sobre() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800 px-6 py-12">
      <div className="max-w-4xl w-full bg-gray-800 shadow-xl rounded-2xl p-10 border border-purple-700 text-center">
        {/* Título */}
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          Sobre Nós
        </h2>

        {/* Texto */}
        <p className="text-lg text-gray-300 leading-relaxed mb-8">
          O <span className="text-purple-400 font-semibold">Passa a Bola</span> nasceu
          com o propósito de valorizar o futebol feminino no Brasil. 
          Nossa missão é aproximar torcedores, jogadoras e apaixonados pelo esporte,
          oferecendo conteúdo de qualidade, notícias, podcasts e um espaço para
          descobertas e interações.
        </p>

        {/* Imagem */}
        <div className="flex justify-center">
          <img
            src="/Grupo.png"
            alt="Equipe Passa a Bola"
            className="rounded-2xl shadow-lg max-w-xl w-full border border-purple-600"
          />
        </div>
      </div>
    </div>
  );
}
