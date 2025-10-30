import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Header from "./components/header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Loja from "./components/Loja";
import Sobre from "./components/Sobre";
import Login from "./components/Login";
import Contato from "./components/Contato";
import Noticias from "./components/Noticias";
import Podcast from "./components/Podcast";
import Peneiras from "./components/Peneiras";
import Estatisticas from "./components/Estatisticas";

function Placeholder() {
  return (
    <div className="text-center text-white py-20">
      <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">
        Página em Construção
      </h2>
      <p className="text-lg">Estamos trabalhando para trazer novidades em breve!</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/peneiras" element={<Peneiras />} />
          <Route path="/estatisticas" element={<Estatisticas />} />
          <Route path="/placeholder" element={<Placeholder />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}
