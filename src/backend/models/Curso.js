const mongoose = require("mongoose");

const AulaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String },
    videoUrl: { type: String },
    ordem: { type: Number, default: 0 }
});

const ModuloSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    descricao: { type: String },
    ordem: { type: Number, default: 0 },
    aulas: [AulaSchema]
});

const CursoSchema = new mongoose.Schema({
    codigoCurso: { type: String, required: true, unique: true },
    titulo: { type: String, required: true },
    descricao: { type: String },
    preco: { type: Number, default: 0 },
    cargaHoraria: { type: Number },
    dataPublicacao: { type: Date, default: Date.now },
    instrutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Instrutor', required: true },
    modulos: [ModuloSchema]
}, { timestamps: true });

module.exports = mongoose.model("Curso", CursoSchema, "cursos");