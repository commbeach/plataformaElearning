const Instrutor = require("./../models/Instrutor.js");

async function buscarTodosInstrutores() {
    try { return await Instrutor.find(); } 
    catch (error) { throw error; }
}

async function criarInstrutor(dados) {
    try {
        const novo = new Instrutor(dados);
        return await novo.save();
    } catch (error) { throw error; }
}

async function atualizarInstrutor(id, dados) {
    try {
        return await Instrutor.findByIdAndUpdate(id, dados, { new: true });
    } catch (error) { throw error; }
}

async function deletarInstrutor(id) {
    try { return await Instrutor.findByIdAndDelete(id); } 
    catch (error) { throw error; }
}

module.exports = { buscarTodosInstrutores, criarInstrutor, atualizarInstrutor, deletarInstrutor };