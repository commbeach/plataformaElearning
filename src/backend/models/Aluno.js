const mongoose = require("mongoose");

const alunoDado = {
    nomAluno: String,
    cpfAluno: String,
    emailAluno: String,
    telAluno: String,
    cidadeAluno: String,
    estadoAluno: String
}

const Aluno = mongoose.model("alunos", alunoDado);

module.exports = Aluno;
