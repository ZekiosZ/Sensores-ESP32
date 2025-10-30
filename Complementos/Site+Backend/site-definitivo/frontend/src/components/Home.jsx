export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center text-white">
      {/* Fundo */}
      <div className="absolute inset-0 bg-[url('/campofoto.png')] bg-cover bg-center brightness-65 -z-10"></div>

      {/* Conteúdo */}
      <div className="text-center flex flex-col items-center justify-center px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
          Bem-vindo ao <span className="bg-purple-900 font-bold rounded px-1">Passa a Bola</span>
        </h2>

        <img
          src="/banner.png"
          alt="Banner"
          className="rounded-2xl shadow-lg mb-6 w-full max-w-3xl"
        />

        <p className="max-w-2xl text-lg text-purple-200 px-3 py-2 rounded">
          O Passa a Bola é um espaço para compartilhar notícias, histórias e curiosidades
          sobre o mundo do futebol. Aqui você encontra conteúdo dinâmico, acessível e
          feito para os verdadeiros apaixonados pelo esporte.
        </p>
      </div>
    </div>
  );
}
