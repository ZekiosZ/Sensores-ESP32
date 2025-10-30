import { Calendar, MapPin } from "lucide-react";

function Peneiras() {
  const peneiras = [
    {
      titulo: "Peneira Sub-17",
      descricao: "Avaliação para jogadoras de 15 a 17 anos",
      data: "20/09/2025",
      local: "Arena Corinthians, São Paulo - SP",
    },
    {
      titulo: "Peneira Aberta",
      descricao: "Oportunidade para jogadoras de todas as idades",
      data: "05/10/2025",
      local: "CT da Portuguesa, São Paulo - SP",
    },
    {
      titulo: "Peneira Universitária",
      descricao: "Foco em atletas universitárias para campeonatos acadêmicos",
      data: "18/10/2025",
      local: "Estádio Nicolau Alayon, Barra Funda - SP",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        {/* Título */}
        <h2 className="text-4xl font-bold mb-6 text-center drop-shadow-lg">
          Próximas Peneiras
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-10 text-gray-300">
          Fique de olho nas próximas peneiras de futebol feminino! Confira datas, locais e requisitos para mostrar seu talento.
        </p>

        {/* Lista de Peneiras */}
        <div className="grid gap-6 md:grid-cols-2">
          {peneiras.map((peneira, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-xl shadow-lg p-6 hover:scale-105 transform transition duration-300"
            >
              <h3 className="text-2xl font-semibold text-purple-400 mb-2">
                {peneira.titulo}
              </h3>
              <p className="text-gray-300 mb-4">{peneira.descricao}</p>
              <div className="flex items-center text-sm text-gray-400 mb-2">
                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                {peneira.data}
              </div>
              <div className="flex items-center text-sm text-gray-400">
                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                {peneira.local}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default Peneiras