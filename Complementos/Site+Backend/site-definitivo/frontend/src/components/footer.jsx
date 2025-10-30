import { Link } from "react-router-dom"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PB</span>
              </div>
              <span className="font-bold text-xl text-white">Passa A Bola</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              O maior portal de futebol feminino do Brasil. Acompanhe as últimas notícias, jogos, peneiras e muito mais
              sobre o universo do futebol feminino.
            </p>
            <div className="flex space-x-4">
              <Link to="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="https://www.instagram.com/passaabola" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="https://www.youtube.com/@passabola" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><Link to="/Noticias" className="text-gray-400 hover:text-purple-400 transition-colors">Notícias</Link></li>
              <li><Link to="/Estatisticas" className="text-gray-400 hover:text-purple-400 transition-colors">Estatísticas</Link></li>
              <li><Link to="/Peneiras" className="text-gray-400 hover:text-purple-400 transition-colors">Peneiras</Link></li>
              <li><Link to="/Podcast" className="text-gray-400 hover:text-purple-400 transition-colors">Podcast</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="font-semibold text-white mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="/contato" className="text-gray-400 hover:text-purple-400 transition-colors">Contato</Link></li>
              <li><Link to="/sobre" className="text-gray-400 hover:text-purple-400 transition-colors">Sobre Nós</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-purple-400 transition-colors">Privacidade</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-purple-400 transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Passa A Bola. Todos os direitos reservados. Futebol Feminino em Primeiro Lugar.
          </p>
        </div>
      </div>
    </footer>
  )
}