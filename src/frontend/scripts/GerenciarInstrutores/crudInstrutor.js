async function carregarInstrutores() {
    try {
        const response = await fetch("/instrutores");
        const dados = await response.json();
        const tbody = document.querySelector("#tabela tbody");
        tbody.innerHTML = "";

        dados.forEach(ins => {
            const tr = document.createElement("tr");
            const e = ins.endereco || {};
            tr.innerHTML = `
                <td>${ins.nomInstrutor}</td>
                <td>${ins.cpfInstrutor}</td>
                <td>${ins.emailInstrutor}</td>
                <td><small>${e.tipoLogradouro || ''} ${e.logradouro || ''}, ${e.numero || ''} - ${e.cidade || ''}/${e.estado || ''}</small></td>
                <td>
                    <button class="btn btn-sm btn-warning me-2" onclick='prepararEdicao(${JSON.stringify(ins)})'>
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deletarInstrutor('${ins._id}')">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) { console.error("Erro:", error); }
}

async function deletarInstrutor(id) {
    if (confirm("Excluir instrutor?")) {
        await fetch(`/instrutores/${id}`, { method: 'DELETE' });
        carregarInstrutores();
    }
}

function prepararEdicao(ins) {
    window.scrollTo(0, 0);
    document.querySelector('h2').innerText = "Editando: " + ins.nomInstrutor;
    
    document.getElementsByName('nomInstrutor')[0].value = ins.nomInstrutor;
    document.getElementsByName('cpfInstrutor')[0].value = ins.cpfInstrutor;
    document.getElementsByName('emailInstrutor')[0].value = ins.emailInstrutor;
    document.getElementsByName('telInstrutor')[0].value = ins.telInstrutor;

    const e = ins.endereco || {};
    document.getElementsByName('tipoLogradouro')[0].value = e.tipoLogradouro || 'Rua';
    document.getElementsByName('logradouro')[0].value = e.logradouro || '';
    document.getElementsByName('numero')[0].value = e.numero || '';
    document.getElementsByName('bairro')[0].value = e.bairro || '';
    document.getElementsByName('cidade')[0].value = e.cidade || '';
    document.getElementsByName('estado')[0].value = e.estado || '';
    document.getElementsByName('cep')[0].value = e.cep || '';

    const form = document.querySelector('#formInstrutor');
    const btn = document.querySelector('#btnSalvar');
    btn.innerText = "Atualizar Instrutor";
    btn.classList.replace('btn-primary', 'btn-success');

    form.onsubmit = async (event) => {
        event.preventDefault();
        const dados = {
            nomInstrutor: document.getElementsByName('nomInstrutor')[0].value,
            cpfInstrutor: document.getElementsByName('cpfInstrutor')[0].value,
            emailInstrutor: document.getElementsByName('emailInstrutor')[0].value,
            telInstrutor: document.getElementsByName('telInstrutor')[0].value,
            endereco: {
                tipoLogradouro: document.getElementsByName('tipoLogradouro')[0].value,
                logradouro: document.getElementsByName('logradouro')[0].value,
                numero: document.getElementsByName('numero')[0].value,
                bairro: document.getElementsByName('bairro')[0].value,
                cidade: document.getElementsByName('cidade')[0].value,
                estado: document.getElementsByName('estado')[0].value,
                cep: document.getElementsByName('cep')[0].value
            }
        };

        await fetch(`/instrutores/${ins._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        location.reload();
    };
}

window.onload = carregarInstrutores;