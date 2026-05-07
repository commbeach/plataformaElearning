const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Importações de arquivos internos
const { API } = require("./chaves.js");

// Importa os módulos de rotas
const pagesRoutes = require("./routes/pages.js");
const alunosRoutes = require("./routes/alunos.js");
const instrutoresRoutes = require("./routes/instrutores.js");
const cursosRoutes = require("./routes/cursos.js");

// 1. CONFIGURAÇÕES E MIDDLEWARES
// Define a raiz do projeto (subindo dois níveis a partir de onde o server.js está)
const projetoRaiz = path.resolve(__dirname, "../../");

// Middleware para processar dados de formulários
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CONFIGURAÇÃO DE ARQUIVOS ESTÁTICOS (IMPORTANTE: Deve vir antes das rotas)
// Isso permite que o navegador encontre as pastas /scripts, /css, etc.
app.use(express.static(projetoRaiz));

// 2. CONEXÃO COM O BANCO DE DADOS
mongoose.connect(API)
    .then(() => console.log("Conectado ao MongoDB Atlas com sucesso!"))
    .catch(err => console.error("Erro ao conectar ao MongoDB:", err));

// 3. MONTAR AS ROTAS SEPARADAS
// Rotas de páginas (HTML)
app.use("/", pagesRoutes(projetoRaiz)); // Passa projetoRaiz para o módulo de rotas de páginas

// Rotas CRUD para Alunos
app.use("/alunos", alunosRoutes); // Todas as rotas dentro de alunos.js serão prefixadas com /alunos

// Rotas CRUD para Instrutores
app.use("/instrutores", instrutoresRoutes); // Todas as rotas dentro de instrutores.js serão prefixadas com /instrutores

// Rotas CRUD e API para Cursos
app.use("/cursos", cursosRoutes); // Todas as rotas dentro de cursos.js serão prefixadas com /cursos

// 4. INICIALIZAÇÃO DO SERVIDOR
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});