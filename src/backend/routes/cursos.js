const express = require("express");
const router = express.Router();
const cursoService = require("../services/cursoService.js"); // Ajuste o caminho

// Rota GET: Listar todos os cursos
router.get("/", async (req, res) => {
    try {
        const cursos = await cursoService.buscarTodosCursos();
        res.json(cursos);
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota GET: Obter detalhes de um curso específico por ID
router.get("/:id", async (req, res) => {
    try {
        const curso = await cursoService.buscarCursoPorId(req.params.id);
        if (curso) {
            res.json(curso);
        } else {
            res.status(404).json({ erro: "Curso não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao buscar curso por ID:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota POST: Criar novo curso
router.post("/", async (req, res) => {
    try {
        await cursoService.criarCurso(req.body);
        res.status(201).json({ success: true, mensagem: "Curso criado com sucesso!" });
    } catch (error) {
        console.error("Erro ao criar curso:", error);
        res.status(500).json({ success: false, erro: error.message });
    }
});

// Rota DELETE: Excluir curso
router.delete("/:id", async (req, res) => {
    try {
        await cursoService.deletarCurso(req.params.id);
        res.json({ success: true, mensagem: "Curso excluído com sucesso!" });
    } catch (error) {
        console.error("Erro ao deletar curso:", error);
        res.status(500).json({ erro: error.message });
    }
});

// Rota PUT: Atualizar curso (se você precisar implementar isso futuramente)
router.put("/:id", async (req, res) => {
    try {
        const cursoAtualizado = await cursoService.atualizarCurso(req.params.id, req.body);
        if (cursoAtualizado) {
            res.json({ success: true, curso: cursoAtualizado, mensagem: "Curso atualizado com sucesso!" });
        } else {
            res.status(404).json({ success: false, mensagem: "Curso não encontrado" });
        }
    } catch (error) {
        console.error("Erro ao atualizar curso:", error);
        res.status(500).json({ success: false, erro: error.message });
    }
});

module.exports = router;