async function carregarAlunos() {
    try {
        const response = await fetch("/alunos");
        const dados = await response.json();

        const tbody = document.querySelector("#tabela tbody");
        tbody.innerHTML = "";

        dados.forEach(aluno => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>${aluno.nomAluno}</td>
                <td>${aluno.cpfAluno}</td>
                <td>${aluno.emailAluno}</td>
                <td>${aluno.telAluno}</td>
                <td>${aluno.cidadeAluno}/${aluno.estadoAluno}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick="prepararEdicao('${aluno._id}', '${aluno.nomAluno}', '${aluno.cpfAluno}', '${aluno.emailAluno}', '${aluno.telAluno}', '${aluno.cidadeAluno}', '${aluno.estadoAluno}')">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletarAluno('${aluno._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar alunos:", error);
    }
}



// --- FUNÇÃO PARA DELETAR ---
async function deletarAluno(id) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
        try {
            const response = await fetch(`/alunos/${id}`, { method: 'DELETE' });
            const result = await response.json();
            
            if (result.success) {
                alert("Aluno excluído!");
                carregarAlunos(); // Recarrega a tabela
            }
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    }
}

// --- FUNÇÃO PARA EDITAR (Lógica simples com prompt ou modal) ---
// Para algo profissional, use um Modal do Bootstrap. Aqui vou preencher o formulário principal para "Editar"
function prepararEdicao(id, nome, cpf, email, tel, cidade, estado) {
    // Rola a página para o topo onde está o formulário
    window.scrollTo(0, 0);
    
    // Altera o título do formulário
    document.querySelector('h2').innerText = "Editando Aluno: " + nome;

    // Preenche os campos do formulário existente
    document.getElementsByName('nomAluno')[0].value = nome;
    document.getElementsByName('cpfAluno')[0].value = cpf;
    document.getElementsByName('emailAluno')[0].value = email;
    document.getElementsByName('telAluno')[0].value = tel;
    document.getElementsByName('cidadeAluno')[0].value = cidade;
    document.getElementsByName('estadoAluno')[0].value = estado;

    // Muda o comportamento do botão para ser um Update em vez de Create
    const form = document.querySelector('form');
    const btn = form.querySelector('button');
    btn.innerText = "Atualizar Dados";
    btn.classList.replace('btn-primary', 'btn-success');

    // Remove o comportamento padrão de POST do form e define a lógica de PUT
    form.onsubmit = async (e) => {
        e.preventDefault();
        
        const dadosAtualizados = {
            nomAluno: document.getElementsByName('nomAluno')[0].value,
            cpfAluno: document.getElementsByName('cpfAluno')[0].value,
            emailAluno: document.getElementsByName('emailAluno')[0].value,
            telAluno: document.getElementsByName('telAluno')[0].value,
            cidadeAluno: document.getElementsByName('cidadeAluno')[0].value,
            estadoAluno: document.getElementsByName('estadoAluno')[0].value,
        };

        try {
            const response = await fetch(`/alunos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });

            if (response.ok) {
                alert("Aluno atualizado com sucesso!");
                location.reload(); // Recarrega para limpar o form e a tela
            }
        } catch (error) {
            console.error("Erro ao atualizar:", error);
        }
    };
}


// executa ao carregar a página
window.onload = carregarAlunos;
