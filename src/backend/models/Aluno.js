const mongoose = require("mongoose");

const AlunoSchema = new mongoose.Schema({
    nomAluno: { type: String, required: true },
    cpfAluno: { type: String, required: true },
    emailAluno: { type: String, required: true },
    telAluno: { type: String },
    endereco: {
        tipoLogradouro: { type: String }, 
        logradouro: { type: String },
        numero: { type: String },
        complemento: { type: String },
        bairro: { type: String },
        cep: { type: String },
        cidade: { type: String },
        estado: { type: String }
    }
});

module.exports = mongoose.model("Aluno", AlunoSchema);