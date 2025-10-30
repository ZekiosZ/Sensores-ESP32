import { useState } from "react";
import { Search, ShoppingCart, Heart } from "lucide-react";

const produtos = [
  {
    id: 1,
    nome: "Camisa Oficial Seleção Brasileira Feminina 2025",
    preco: 199.99,
    precoAntigo: 249.99,
    imagem: "/camisa1.webp",
    destaque: true,
    novo: true,
    avaliacao: 4.8,
    reviews: 210,
    categoria: "Camisas",
  },
  {
    id: 2,
    nome: "Boné Passa a Bola - Edição Limitada",
    preco: 89.99,
    imagem: "/bone1.png",
    destaque: true,
    novo: false,
    avaliacao: 4.6,
    reviews: 98,
    categoria: "Bonés",
  },
  {
    id: 3,
    nome: "Chuteira Nike Mercurial Feminina",
    preco: 399.99,
    precoAntigo: 499.99,
    imagem: "/chuteira1.avif",
    destaque: false,
    novo: false,
    avaliacao: 4.7,
    reviews: 203,
    categoria: "Calçados",
  },
  {
    id: 4,
    nome: "Mochila Esportiva Futebol Feminino",
    preco: 149.99,
    imagem: "/mochila1.webp",
    destaque: false,
    novo: true,
    avaliacao: 4.6,
    reviews: 156,
    categoria: "Acessórios",
  },
];

function Loja() {
  const [categoria, setCategoria] = useState("Todos");
  const [busca, setBusca] = useState("");

  const categorias = ["Todos", "Camisas", "Bonés", "Acessórios", "Calçados"];

  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria = categoria === "Todos" || p.categoria === categoria;
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      {/* Título */}
      <h1 className="text-4xl font-bold mb-2">Loja Passa a Bola</h1>
      <p className="text-gray-400 mb-8">
        Produtos oficiais e exclusivos para quem vive o futebol feminino.
        Camisas, acessórios e muito mais!
      </p>

      {/* Filtros e busca */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex gap-3 flex-wrap">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                categoria === cat
                  ? "bg-purple-700 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-gray-800 rounded-lg px-3 py-2 w-full md:w-72">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="bg-transparent focus:outline-none w-full text-sm text-white"
          />
        </div>

        <button className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg font-semibold">
          <ShoppingCart size={18} /> Carrinho
        </button>
      </div>

      {/* Produtos */}
      <h2 className="text-2xl font-semibold mb-6">Produtos em Destaque</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {produtosFiltrados
          .filter((p) => p.destaque)
          .map((produto) => (
            <ProdutoCard key={produto.id} produto={produto} />
          ))}
      </div>

      <h2 className="text-2xl font-semibold mb-6">Todos os Produtos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosFiltrados.map((produto) => (
          <ProdutoCard key={produto.id} produto={produto} />
        ))}
      </div>
    </div>
  );
}

function ProdutoCard({ produto }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 flex flex-col relative">
      <img
        src={produto.imagem}
        alt={produto.nome}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Tags */}
      <div className="absolute top-3 left-3 flex gap-2">
        {produto.destaque && (
          <span className="bg-purple-600 text-xs px-2 py-1 rounded-md">
            Destaque
          </span>
        )}
        {produto.novo && (
          <span className="bg-green-600 text-xs px-2 py-1 rounded-md">Novo</span>
        )}
      </div>

      {/* Coração */}
      <button className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
        <Heart size={20} />
      </button>

      {/* Info */}
      <h3 className="text-lg font-semibold">{produto.nome}</h3>
      <p className="text-gray-400 text-sm mb-2">
        ⭐ {produto.avaliacao} ({produto.reviews})
      </p>

      <div className="mt-auto flex items-center justify-between">
        <div>
          <p className="text-purple-400 font-bold">
            R$ {produto.preco.toFixed(2)}
          </p>
          {produto.precoAntigo && (
            <p className="text-sm text-gray-500 line-through">
              R$ {produto.precoAntigo.toFixed(2)}
            </p>
          )}
        </div>
        <button className="bg-purple-700 hover:bg-purple-800 px-4 py-2 rounded-lg text-sm font-semibold">
          Comprar
        </button>
      </div>
    </div>
  );
}

export default Loja;
