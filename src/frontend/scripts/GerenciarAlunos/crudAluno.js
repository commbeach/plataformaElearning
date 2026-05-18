let alunoModalAtualId = null; // Variável global para guardar o ID do aluno selecionado no modal

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
                    <button class="btn btn-sm btn-info me-2 text-white" onclick='abrirModalCursos(${JSON.stringify(aluno)})' title="Cursos">
                        <i class="bi bi-book"></i>
                    </button>
                    <button class="btn btn-sm btn-warning me-2" onclick='prepararEdicao(${JSON.stringify(aluno)})' title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletarAluno('${aluno._id}')" title="Excluir">
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

// ==========================================
// FUNÇÕES DO MODAL DE CURSOS
// ==========================================

async function abrirModalCursos(aluno) {
    alunoModalAtualId = aluno._id;
    document.getElementById('modalCursosLabel').innerText = `Cursos de: ${aluno.nomAluno}`;
    
    try {
        // 1. Busca todos os cursos disponíveis
        const resCursos = await fetch('/cursos');
        const todosCursos = await resCursos.json();
        
        // 2. Extrai os IDs dos cursos em que o aluno já se inscreveu
        const inscritos = aluno.cursosInscritos || [];
        
        const lista = document.getElementById('listaCursosModal');
        lista.innerHTML = ""; 

        if (todosCursos.length === 0) {
            lista.innerHTML = `<p class="text-muted text-center mt-3">Nenhum curso cadastrado no sistema.</p>`;
        } else {
            todosCursos.forEach(curso => {
                // 3. Verifica se o curso atual está na lista de inscrições do aluno
                const taInscrito = inscritos.includes(curso._id);
                
                // 4. Configura as classes e atributos do botão de Inscrição
                const btnClass = taInscrito ? 'btn-secondary' : 'btn-primary';
                const btnText = taInscrito ? 'Inscrito' : 'Inscrever';
                const disabledAttr = taInscrito ? 'disabled' : '';

                // 5. Gera AMBOS os botões
                const btnInscrever = `<button class="btn ${btnClass} btn-sm me-2" onclick="inscreverCurso('${curso._id}', this)" ${disabledAttr}><i class="bi bi-plus-circle"></i> ${btnText}</button>`;
                const btnAssistir = `<a href="/Assistir?id=${curso._id}" class="btn btn-success btn-sm"><i class="bi bi-play-circle"></i> Assistir</a>`;

                // 6. Previne erro caso o preço venha nulo do banco
                const precoFormatado = curso.preco ? curso.preco.toFixed(2) : "0.00";

                lista.innerHTML += `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-0 fw-bold">${curso.titulo}</h6>
                            <small class="text-muted">Carga Horária: ${curso.cargaHoraria || '--'}h | Preço: R$ ${precoFormatado}</small>
                        </div>
                        <div>
                            ${btnInscrever}
                            ${btnAssistir}
                        </div>
                    </div>
                `;
            });
        }

        // Exibe o modal utilizando a API do Bootstrap
        const modal = new bootstrap.Modal(document.getElementById('modalCursos'));
        modal.show();

    } catch (error) {
        console.error("Erro ao carregar modal de cursos:", error);
    }
}

// Repare que adicionamos o parâmetro 'btnElement'
async function inscreverCurso(cursoId, btnElement) {
    if (!alunoModalAtualId) return;

    // Feedback visual imediato de carregamento
    const textoOriginal = btnElement.innerHTML;
    btnElement.innerHTML = `<i class="bi bi-hourglass-split"></i> Aguarde...`;
    btnElement.disabled = true;

    try {
        const res = await fetch(`/alunos/${alunoModalAtualId}/inscrever`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cursoId })
        });

        const data = await res.json();
        
        if (data.success) {
            // Sucesso! Atualiza o botão visualmente sem fechar o modal
            btnElement.innerHTML = `<i class="bi bi-check-circle"></i> Inscrito`;
            btnElement.classList.replace('btn-primary', 'btn-secondary');
            
            // Recarrega a tabela de alunos no fundo silenciosamente
            carregarAlunos(); 
        } else {
            // Em caso de erro, devolve o botão ao estado normal
            btnElement.innerHTML = textoOriginal;
            btnElement.disabled = false;
            alert("Erro: " + data.erro);
        }
    } catch (error) {
        console.error("Erro ao inscrever:", error);
        btnElement.innerHTML = textoOriginal;
        btnElement.disabled = false;
    }
}

window.onload = carregarAlunos;