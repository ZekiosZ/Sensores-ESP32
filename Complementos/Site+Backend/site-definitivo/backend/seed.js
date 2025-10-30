const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "usuarios.json");

const usuariosSeed = [
  { email: "admin@email.com", senha: "admin123" },
  { email: "teste2@email.com", senha: "senha123" },
  { email: "carla@email.com", senha: "4321" }
];

fs.writeFileSync(filePath, JSON.stringify(usuariosSeed, null, 2));
console.log("Seed gerado com sucesso em backend/usuarios.json!");
