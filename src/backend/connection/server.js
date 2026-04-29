const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

// Importações de arquivos internos
const { API } = require("./chaves.js");
const Aluno = require("./../models/Aluno.js");
const alunoService = require("../services/alunoService.js");

// 1. CONFIGURAÇÕES E MIDDLEWARES
// Define a raiz do projeto (subindo dois níveis a partir de onde o server.js está)
const projetoRaiz = path.resolve(__dirname, "../../../");

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

    
// 3. ROTAS de páginas
app.get("/", function(req, res) {
    const caminhoHtml = path.join(projetoRaiz, "/src/frontend/pages/GerenciarAlunos.html");
    res.sendFile(caminhoHtml);
});

app.get("/GerenciarInstrutores", function(req, res) {
    const caminhoHtml = path.join(projetoRaiz, "/src/frontend/pages/GerenciarInstrutores.html");
    res.sendFile(caminhoHtml);
});


//ROTAS DE ALUNO
// Rota POST: Criar aluno (Refatorada para usar o Service e Async/Await)
app.post("/", async function(req, res) {
    try {
        // Usando o service para manter o padrão arquitetural
        await alunoService.criarAluno({
            nomAluno: req.body.nomAluno,
            cpfAluno: req.body.cpfAluno,
            emailAluno: req.body.emailAluno,
            telAluno: req.body.telAluno,
            cidadeAluno: req.body.cidadeAluno,
            estadoAluno: req.body.estadoAluno
        });
        
        console.log("Aluno cadastrado com sucesso!");
        res.redirect('/'); // Redireciona após o sucesso do salvamento
    } catch (error) {
        console.error("Erro ao cadastrar aluno:", error);
        res.status(500).send("Erro ao salvar no banco de dados.");
    }
});

// Rota DELETE: Excluir Aluno
app.delete("/alunos/:id", async (req, res) => {
    try {
        await alunoService.deletarAluno(req.params.id);
        res.json({ success: true, mensagem: "Aluno excluído com sucesso" });
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

// Rota GET: API que retorna o JSON dos alunos para o crudAluno.js
app.get("/alunos", async (req, res) => {
    try {
        const alunos = await alunoService.buscarTodosAlunos();
        res.json(alunos);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
});

app.put("/alunos/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dadosNovos = req.body; // O body-parser vai ler os dados enviados pelo fetch

        // Chama a função que já existe no seu alunoService
        const alunoAtualizado = await alunoService.atualizarAluno(id, dadosNovos);

        if (alunoAtualizado) {
            console.log("Aluno atualizado com sucesso!");
            res.json({ success: true, aluno: alunoAtualizado });
        } else {
            res.status(404).json({ success: false, mensagem: "Aluno não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar aluno:", error);
        res.status(500).json({ success: false, erro: error.message });
    }
});


// 4. INICIALIZAÇÃO DO SERVIDOR
const PORT = 3000;
app.listen(PORT, function() {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});