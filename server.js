const express = require ("express");
const app = express ();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { API } = require("./chaves.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname));


mongoose.connect(
  API,
);

const alunoDado = {
    nomAluno: String,
    cpfAluno: String,
    emailAluno: String,
    telAluno: String,
    cidadeAluno: String,
    estadoAluno: String

}

const Aluno = mongoose.model("alunos", alunoDado)

app. get("/", function(req,res){
    res.sendFile(__dirname+"/index.html");
})

app.post("/", function(req,res){
    let newAluno = new Aluno({
        nomAluno: req.body.nomAluno,
        cpfAluno: req.body.cpfAluno,
        emailAluno: req.body.emailAluno,
        telAluno: req.body.telAluno,
        cidadeAluno: req.body.cidadeAluno,
        estadoAluno: req.body.estadoAluno
    });
    newAluno.save();
    res.redirect('/');
})

app.get("/alunos", async (req, res) => {
  const alunos = await Aluno.find();
  res.json(alunos);
});

//app.post
app.listen(3000, function() {
    console.log("server is running on 3000");
})