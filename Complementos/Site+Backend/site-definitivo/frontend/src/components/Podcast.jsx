function Podcast() {
  const videos = [
    "https://www.youtube.com/embed/pr4wX4hCVLs", // Episódio 1
    "https://www.youtube.com/embed/e8JkJlnrCAQ?si=JkK7P4b5qX1zZ0V_", // Episódio 2
    "https://www.youtube.com/embed/TkEfC_D_I-0?si=q0u57euAGYcxYGJf", // Episódio 3
  ];

  return (
    <div className="flex flex-col items-center justify-center py-10 text-white bg-gradient-to-b from-black via-gray-900 to-black">
      <h2 className="text-4xl font-bold mb-6 drop-shadow-lg">🎙️ Podcast</h2>
      <p className="max-w-2xl text-lg text-center mb-10">
        Escute os episódios mais recentes do <span className="font-semibold">Passa a Bola Podcast</span>!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-6">
        {videos.map((link, index) => (
          <div
            key={index}
            className="rounded-2xl overflow-hidden shadow-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <iframe
              width="100%"
              height="250"
              src={link}
              title={`Episódio ${index + 1}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64"
            ></iframe>
            <div className="bg-gray-800 p-4 text-center">
              <h3 className="text-lg font-semibold">Episódio {index + 1}</h3>
              <p className="text-sm text-gray-400">
                Clique e assista diretamente aqui 🎧
              </p>
            </div>
          </div>
        ))}
      </div>

      <a
        href="https://www.youtube.com/playlist?list=PLxa3TGtdFp-3kuhXMlQPI80_mSqAQu8qO"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-block px-6 py-3 bg-red-600 rounded-xl font-semibold hover:bg-red-700 transition"
      >
        Ver todos os episódios no YouTube
      </a>
    </div>
  );
}
export default Podcast
