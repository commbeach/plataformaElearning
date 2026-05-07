const Curso = require("../models/Curso.js");

async function buscarTodosCursos() {
    return await Curso.find().populate('instrutorId', 'nomInstrutor');
}

async function criarCurso(dados) {
    const novoCurso = new Curso(dados);
    return await novoCurso.save();
}

async function atualizarCurso(id, dados) {
    return await Curso.findByIdAndUpdate(id, dados, { new: true });
}

async function deletarCurso(id) {
    return await Curso.findByIdAndDelete(id);
}
async function buscarCursoPorId(id) {
    return await Curso.findById(id).populate('instrutorId', 'nomInstrutor');
}


module.exports = { buscarTodosCursos, criarCurso, atualizarCurso, deletarCurso, buscarCursoPorId };