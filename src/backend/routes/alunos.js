const express = require("express");
const router = express.Router();
const alunoService = require("../services/alunoService.js"); // Ajuste o caminho conforme sua estrutura

// Rota POST: Criar aluno (Agora em /alunos)
router.post("/", async (req, res) => {
    try {
        await alunoService.criarAluno({
            nomAluno: req.body.nomAluno,
            cpfAluno: req.body.cpfAluno,
            emailAluno: req.body.emailAluno,
            telAluno: req.body.telAluno,
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
        // Após o POST, redireciona para a página de gerenciar alunos
        res.redirect('/'); 
    } catch (error) {
        console.error("Erro ao salvar aluno:", error);
        res.status(500).send("Erro ao salvar no banco de dados: " + error.message);
    }
});

// Rota GET: API que retorna o JSON dos alunos
router.get("/", async (req, res) => {
    try {
        const alunos = await alunoService.buscarTodosAlunos();
        res.json(alunos);
    } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota PUT: Atualizar Aluno
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const dadosNovos = req.body;
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

// Rota DELETE: Excluir Aluno
router.delete("/:id", async (req, res) => {
    try {
        await alunoService.deletarAluno(req.params.id);
        res.json({ success: true, mensagem: "Aluno excluído com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar aluno:", error);
        res.status(500).json({ erro: error.message });
    }
});

module.exports = router;