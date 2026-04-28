async function carregarAlunos() {
  try {
    const response = await fetch("./alunos");
    const dados = await response.json();

    const tbody = document.querySelector("#tabela tbody");
    tbody.innerHTML = "";

    dados.forEach(aluno => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${aluno._id}</td>
        <td>${aluno.nomAluno}</td>
        <td>${aluno.cpfAluno}</td>
        <td>${aluno.emailAluno}</td>
        <td>${aluno.telAluno}</td>
        <td>${aluno.cidadeAluno}</td>
        <td>${aluno.estadoAluno}</td>
      `;

      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
  }
}

// executa ao carregar a página
window.onload = carregarAlunos;
