async function carregarAlunos() {
    try {
        const response = await fetch("/alunos");
        const dados = await response.json();

        const tbody = document.querySelector("#tabela tbody");
        tbody.innerHTML = "";

        dados.forEach(aluno => {
            const tr = document.createElement("tr");
            const e = aluno.endereco || {}; // Garante que não quebre se não houver endereço

            tr.innerHTML = `
                <td>${aluno.nomAluno}</td>
                <td>${aluno.cpfAluno}</td>
                <td>${aluno.emailAluno}</td>
                <td>
                    <small>
                        ${e.tipoLogradouro || ''} ${e.logradouro || ''}, ${e.numero || ''} 
                        ${e.complemento ? '('+e.complemento+')' : ''} - ${e.bairro || ''}<br>
                        ${e.cidade || ''}/${e.estado || ''} - CEP: ${e.cep || ''}
                    </small>
                </td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick='prepararEdicao(${JSON.stringify(aluno)})'>
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

async function deletarAluno(id) {
    if (confirm("Tem certeza que deseja excluir este aluno?")) {
        try {
            const response = await fetch(`/alunos/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) { carregarAlunos(); }
        } catch (error) { console.error("Erro ao deletar:", error); }
    }
}

function prepararEdicao(aluno) {
    window.scrollTo(0, 0);
    document.querySelector('h2').innerText = "Editando Aluno: " + aluno.nomAluno;

    // Preenche campos básicos
    document.getElementsByName('nomAluno')[0].value = aluno.nomAluno;
    document.getElementsByName('cpfAluno')[0].value = aluno.cpfAluno;
    document.getElementsByName('emailAluno')[0].value = aluno.emailAluno;
    document.getElementsByName('telAluno')[0].value = aluno.telAluno;

    // Preenche campos de endereço
    const e = aluno.endereco || {};
    document.getElementsByName('tipoLogradouro')[0].value = e.tipoLogradouro || 'Rua';
    document.getElementsByName('logradouro')[0].value = e.logradouro || '';
    document.getElementsByName('numero')[0].value = e.numero || '';
    document.getElementsByName('complemento')[0].value = e.complemento || '';
    document.getElementsByName('bairro')[0].value = e.bairro || '';
    document.getElementsByName('cep')[0].value = e.cep || '';
    document.getElementsByName('cidade')[0].value = e.cidade || '';
    document.getElementsByName('estado')[0].value = e.estado || '';

    const form = document.querySelector('#formAluno');
    const btn = document.querySelector('#btnSalvar');
    btn.innerText = "Atualizar Dados";
    btn.classList.replace('btn-primary', 'btn-success');

    form.onsubmit = async (event) => {
        event.preventDefault();
        
        const dadosAtualizados = {
            nomAluno: document.getElementsByName('nomAluno')[0].value,
            cpfAluno: document.getElementsByName('cpfAluno')[0].value,
            emailAluno: document.getElementsByName('emailAluno')[0].value,
            telAluno: document.getElementsByName('telAluno')[0].value,
            endereco: {
                tipoLogradouro: document.getElementsByName('tipoLogradouro')[0].value,
                logradouro: document.getElementsByName('logradouro')[0].value,
                numero: document.getElementsByName('numero')[0].value,
                complemento: document.getElementsByName('complemento')[0].value,
                bairro: document.getElementsByName('bairro')[0].value,
                cep: document.getElementsByName('cep')[0].value,
                cidade: document.getElementsByName('cidade')[0].value,
                estado: document.getElementsByName('estado')[0].value
            }
        };

        try {
            const response = await fetch(`/alunos/${aluno._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados)
            });

            if (response.ok) {
                alert("Aluno atualizado!");
                location.reload();
            }
        } catch (error) { console.error("Erro ao atualizar:", error); }
    };
}

window.onload = carregarAlunos;