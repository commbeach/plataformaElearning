const Aluno = require("./../models/Aluno.js");

async function buscarTodosAlunos() {
    try { return await Aluno.find(); } 
    catch (error) { throw error; }
}

async function criarAluno(dadosAluno) {
    try {
        const novoAluno = new Aluno(dadosAluno);
        return await novoAluno.save();
    } catch (error) { throw error; }
}

async function atualizarAluno(id, dadosAluno) {
    try {
        return await Aluno.findByIdAndUpdate(id, dadosAluno, { new: true });
    } catch (error) { throw error; }
}

async function deletarAluno(id) {
    try { return await Aluno.findByIdAndDelete(id); } 
    catch (error) { throw error; }
}

module.exports = { buscarTodosAlunos, criarAluno, atualizarAluno, deletarAluno };