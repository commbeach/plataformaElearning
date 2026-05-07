const express = require("express");
const path = require("path");
const router = express.Router();

module.exports = (projetoRaiz) => {
    // Agora a página de alunos abre tanto no "/" quanto no "/GerenciarAlunos"
    router.get("/", function(req, res) {
        res.sendFile(path.join(projetoRaiz, "/src/frontend/pages/GerenciarAlunos.html"));
    });

    router.get("/GerenciarAlunos", function(req, res) {
        res.sendFile(path.join(projetoRaiz, "/src/frontend/pages/GerenciarAlunos.html"));
    });

    router.get("/GerenciarInstrutores", function(req, res) {
        res.sendFile(path.join(projetoRaiz, "/src/frontend/pages/GerenciarInstrutores.html"));
    });

    router.get("/GerenciarCursos", (req, res) => {
        res.sendFile(path.join(projetoRaiz, "/src/frontend/pages/GerenciarCursos.html"));
    });

    router.get("/Assistir", (req, res) => {
        res.sendFile(path.join(projetoRaiz, "/src/frontend/pages/AssistirCurso.html"));
    });

    return router;
};