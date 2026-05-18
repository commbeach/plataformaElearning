const express = require("express");
const router = express.Router();
const alunoService = require("../services/alunoService.js"); // Ajuste o caminho conforme sua estrutura
const Aluno = require("../models/Aluno.js");
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


router.post("/:id/inscrever", async (req, res) => {
    try {
        const alunoId = req.params.id;
        const { cursoId } = req.body;
        
        const aluno = await Aluno.findById(alunoId);
        if (!aluno) return res.status(404).json({ success: false, erro: "Aluno não encontrado" });

        // Inicia o array se o aluno for antigo e não tiver
        if (!aluno.cursosInscritos) aluno.cursosInscritos = [];
        
        // Adiciona a FK do curso apenas se ele já não estiver inscrito
        if (!aluno.cursosInscritos.includes(cursoId)) {
            aluno.cursosInscritos.push(cursoId);
            await aluno.save();
        }

        res.json({ success: true, mensagem: "Inscrição realizada com sucesso!" });
    } catch (error) {
        console.error("Erro na inscrição:", error);
        res.status(500).json({ success: false, erro: error.message });
    }
});


module.exports = router;