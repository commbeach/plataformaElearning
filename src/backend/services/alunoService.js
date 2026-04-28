const Aluno = require("./../models/Aluno.js");

// Buscar todos os alunos
async function buscarTodosAlunos() {
  try {
    const alunos = await Aluno.find();
    return alunos;
  } catch (error) {
    console.error("Erro ao buscar alunos:", error);
    throw error;
  }
}

// Criar novo aluno
async function criarAluno(dadosAluno) {
  try {
    const novoAluno = new Aluno(dadosAluno);
    await novoAluno.save();
    return novoAluno;
  } catch (error) {
    console.error("Erro ao criar aluno:", error);
    throw error;
  }
}

// Atualizar aluno
async function atualizarAluno(id, dadosAluno) {
  try {
    const aluno = await Aluno.findByIdAndUpdate(id, dadosAluno, { new: true });
    return aluno;
  } catch (error) {
    console.error("Erro ao atualizar aluno:", error);
    throw error;
  }
}

// Deletar aluno
async function deletarAluno(id) {
  try {
    await Aluno.findByIdAndDelete(id);
    return { mensagem: "Aluno deletado com sucesso" };
  } catch (error) {
    console.error("Erro ao deletar aluno:", error);
    throw error;
  }
}

module.exports = {
  buscarTodosAlunos,
  criarAluno,
  atualizarAluno,
  deletarAluno
};
