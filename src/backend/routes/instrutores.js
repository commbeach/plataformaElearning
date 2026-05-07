const express = require("express");
const router = express.Router();
const instrutorService = require("../services/instrutorService.js"); // Ajuste o caminho

// Rota GET: Listar todos os instrutores
router.get("/", async (req, res) => {
    try {
        const dados = await instrutorService.buscarTodosInstrutores();
        res.json(dados);
    } catch (error) {
        console.error("Erro ao buscar instrutores:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota POST: Criar instrutor
router.post("/", async (req, res) => {
    try {
        await instrutorService.criarInstrutor({
            nomInstrutor: req.body.nomInstrutor,
            cpfInstrutor: req.body.cpfInstrutor,
            emailInstrutor: req.body.emailInstrutor,
            telInstrutor: req.body.telInstrutor,
            endereco: {
                tipoLogradouro: req.body.tipoLogradouro,
                logradouro: req.body.logradouro,
                numero: req.body.numero,
                complemento: req.body.complemento,
                bairro: req.body.bairro,
                cep: req.body.cep,
                cidade: req.body.cidade,
                estado: req.body.estado
            }
        });
        res.redirect('/GerenciarInstrutores');
    } catch (error) {
        console.error("Erro ao criar instrutor:", error);
        res.status(500).send("Erro ao salvar no banco de dados: " + error.message);
    }
});

// Rota PUT: Atualizar instrutor
router.put("/:id", async (req, res) => {
    try {
        const atualizado = await instrutorService.atualizarInstrutor(req.params.id, req.body);
        if (atualizado) {
            res.json({ success: true, instrutor: atualizado });
        } else {
            res.status(404).json({ success: false, mensagem: "Instrutor não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar instrutor:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota DELETE: Excluir instrutor
router.delete("/:id", async (req, res) => {
    try {
        await instrutorService.deletarInstrutor(req.params.id);
        res.json({ success: true, mensagem: "Instrutor excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar instrutor:", error);
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;