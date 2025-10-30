import { useEffect, useState } from "react";

export default function Noticias() {
  const [noticias, setNoticias] = useState([]);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    async function fetchNoticias() {
      try {
        const res = await fetch(
          `https://newsapi.org/v2/everything?q=futebol%20feminino&language=pt&apiKey=c3b6c64e482940eba1a468e5f46a03bc`
        );
        const data = await res.json();
        setNoticias(data.articles || []);
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    }

    fetchNoticias();
  }, []);

  //sistema de filtro
  const noticiasFiltradas =
    filtro === "todas"
      ? noticias
      : noticias.filter((n) =>
          (n.title + n.description)
            .toLowerCase()
            .includes(filtro.toLowerCase())
        );

  const destaques = noticiasFiltradas.slice(0, 2);
  const todas = noticiasFiltradas.slice(2);

  return (
    <div className="max-w mx-auto p-6 bg-gray-900">
      <h1 className="text-3xl font-bold text-white text-center mb-2">
        Notícias do Futebol Feminino
      </h1>
      <p className="text-gray-400 text-center mb-6">
        Fique por dentro de tudo que acontece no universo do futebol feminino.
      </p>

      {/* Botões de filtro */}
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {["todas", "jogos", "atletas", "campeonatos", "mercado"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFiltro(cat)}
            className={`px-4 py-2 rounded-lg ${
              filtro === cat
                ? "bg-purple-600 text-white"
                : "bg-gray-800 text-gray-300"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Destaques */}
      <h2 className="text-2xl font-bold text-white mb-4">Destaques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {destaques.map((noticia, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl shadow-md overflow-hidden"
          >
            {noticia.urlToImage && (
              <img
                src={noticia.urlToImage}
                alt={noticia.title}
                className="w-full h-56 object-cover"
              />
            )}
            <div className="p-4">
              <span className="text-sm text-purple-400">Destaque</span>
              <h3 className="text-lg font-bold text-white mt-1">
                {noticia.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2">
                {noticia.description}
              </p>
              <a
                href={noticia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 text-sm mt-3 inline-block"
              >
                Ler mais →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Todas as Notícias */}
      <h2 className="text-2xl font-bold text-white mb-4">Todas as Notícias</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {todas.map((noticia, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded-2xl shadow-md overflow-hidden"
          >
            {noticia.urlToImage && (
              <img
                src={noticia.urlToImage}
                alt={noticia.title}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-white">
                {noticia.title}
              </h3>
              <p className="text-gray-300 text-sm mt-2 line-clamp-3">
                {noticia.description}
              </p>
              <a
                href={noticia.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 text-sm mt-3 inline-block"
              >
                Ler mais →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
