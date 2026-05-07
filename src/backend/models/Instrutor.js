const mongoose = require("mongoose");

const InstrutorSchema = new mongoose.Schema({
    nomInstrutor: { type: String, required: true },
    cpfInstrutor: { type: String, required: true },
    emailInstrutor: { type: String, required: true },
    telInstrutor: { type: String },
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

module.exports = mongoose.model("Instrutor", InstrutorSchema, "instrutores");