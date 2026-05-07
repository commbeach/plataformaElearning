let moduloCount = 0;

// --- CARREGAR INSTRUTORES ---
async function carregarInstrutores() {
    const res = await fetch('/instrutores');
    const instrutores = await res.json();
    const select = document.getElementById('instrutorId');
    select.innerHTML = '<option value="">Selecione um Instrutor</option>';
    instrutores.forEach(ins => {
        select.innerHTML += `<option value="${ins._id}">${ins.nomInstrutor}</option>`;
    });
}

// --- ADICIONAR MÓDULO (SUPORTA CRIAÇÃO E EDIÇÃO) ---
function addModulo(dados = null) {
    const container = document.getElementById('container-modulos');
    const moduloId = `modulo-${moduloCount++}`;
    
    const html = `
        <div class="modulo-item p-3 mb-3 shadow-sm border-start border-primary border-4" id="${moduloId}" style="background: #f8f9fa;">
            <div class="row g-2">
                <div class="col-md-8">
                    <label class="small text-muted">Título do Módulo</label>
                    <input type="text" class="form-control form-control-sm fw-bold modulo-titulo" value="${dados ? dados.titulo : ''}" placeholder="Ex: Introdução">
                </div>
                <div class="col-md-3">
                    <label class="small text-muted">Ordem</label>
                    <input type="number" class="form-control form-control-sm modulo-ordem" value="${dados ? dados.ordem : ''}" placeholder="0">
                </div>
                <div class="col-md-1 text-end align-self-end">
                    <button type="button" class="btn btn-danger btn-sm" onclick="document.getElementById('${moduloId}').remove()">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <div class="container-aulas mt-3 ms-4 p-2 border-start">
                <h6 class="small fw-bold text-secondary">Aulas deste Módulo:</h6>
                <div class="lista-aulas"></div>
                <button type="button" class="btn btn-link btn-sm p-0 mt-2 text-decoration-none" onclick="addAula('${moduloId}')">
                    <i class="bi bi-plus"></i> Adicionar Aula
                </button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);

    if (dados && dados.aulas) {
        dados.aulas.forEach(aula => addAula(moduloId, aula));
    }
}

// --- ADICIONAR AULA (SUPORTA CRIAÇÃO E EDIÇÃO) ---
function addAula(moduloId, dados = null) {
    const listaAulas = document.querySelector(`#${moduloId} .lista-aulas`);
    const html = `
        <div class="aula-item p-2 mb-2 shadow-sm border bg-white rounded">
            <div class="row g-2">
                <div class="col-md-4">
                    <input type="text" class="form-control form-control-sm aula-titulo" value="${dados ? dados.titulo : ''}" placeholder="Título da Aula">
                </div>
                <div class="col-md-4">
                    <input type="text" class="form-control form-control-sm aula-url" value="${dados ? dados.videoUrl : ''}" placeholder="URL do Vídeo">
                </div>
                <div class="col-md-2">
                    <input type="number" class="form-control form-control-sm aula-ordem" value="${dados ? dados.ordem : ''}" placeholder="Ordem">
                </div>
                <div class="col-md-2 text-end">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="this.closest('.aula-item').remove()">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    listaAulas.insertAdjacentHTML('beforeend', html);
}

// --- PREPARAR FORMULÁRIO PARA EDIÇÃO ---
async function prepararEdicao(id) {
    try {
        const res = await fetch(`/cursos/${id}`);
        const curso = await res.json();

        window.scrollTo(0, 0);
        document.querySelector('h2').innerText = "Editando Curso: " + curso.titulo;
        
        document.getElementById('cursoIdAtual').value = curso._id;
        document.getElementById('codigoCurso').value = curso.codigoCurso;
        document.getElementById('titulo').value = curso.titulo;
        document.getElementById('instrutorId').value = curso.instrutorId._id || curso.instrutorId;
        document.getElementById('descricao').value = curso.descricao;
        document.getElementById('preco').value = curso.preco;
        document.getElementById('cargaHoraria').value = curso.cargaHoraria;

        document.getElementById('container-modulos').innerHTML = "";
        curso.modulos.forEach(mod => addModulo(mod));

        const btn = document.querySelector('button[type="submit"]');
        btn.innerText = "Atualizar Curso";
        btn.classList.replace('btn-primary', 'btn-success');
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

// --- SALVAR OU ATUALIZAR ---
document.getElementById('formCurso').onsubmit = async (e) => {
    e.preventDefault();

    const cursoId = document.getElementById('cursoIdAtual').value;
    
    const cursoData = {
        codigoCurso: document.getElementById('codigoCurso').value,
        titulo: document.getElementById('titulo').value,
        descricao: document.getElementById('descricao').value,
        instrutorId: document.getElementById('instrutorId').value,
        preco: parseFloat(document.getElementById('preco').value),
        cargaHoraria: parseInt(document.getElementById('cargaHoraria').value),
        modulos: []
    };

    document.querySelectorAll('.modulo-item').forEach(modEl => {
        const modulo = {
            titulo: modEl.querySelector('.modulo-titulo').value,
            ordem: parseInt(modEl.querySelector('.modulo-ordem').value) || 0,
            aulas: []
        };
        modEl.querySelectorAll('.aula-item').forEach(aulaEl => {
            modulo.aulas.push({
                titulo: aulaEl.querySelector('.aula-titulo').value,
                videoUrl: aulaEl.querySelector('.aula-url').value,
                ordem: parseInt(aulaEl.querySelector('.aula-ordem').value) || 0
            });
        });
        cursoData.modulos.push(modulo);
    });

    const url = cursoId ? `/cursos/${cursoId}` : '/cursos';
    const method = cursoId ? 'PUT' : 'POST';

    const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cursoData)
    });

    if (res.ok) {
        alert(cursoId ? "Curso atualizado!" : "Curso criado!");
        location.reload();
    }
};

// --- LISTAGEM COM TODOS OS BOTÕES ---
async function carregarTabela() {
    const res = await fetch('/cursos');
    const cursos = await res.json();
    const tbody = document.querySelector("#tabelaCursos tbody");
    tbody.innerHTML = "";
    
    cursos.forEach(c => {
        tbody.innerHTML += `
            <tr>
                <td>${c.codigoCurso}</td>
                <td>${c.titulo}</td>
                <td>${c.instrutorId?.nomInstrutor || 'N/A'}</td>
                <td>R$ ${c.preco.toFixed(2)}</td>
                <td>
                    <div class="btn-group">
                        <a href="/Assistir?id=${c._id}" class="btn btn-sm btn-primary" title="Assistir">
                            <i class="bi bi-play-fill"></i>
                        </a>
                        <button class="btn btn-sm btn-warning" onclick="prepararEdicao('${c._id}')" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deletarCurso('${c._id}')" title="Excluir">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
}

async function deletarCurso(id) {
    if(confirm("Deseja excluir este curso?")) {
        await fetch(`/cursos/${id}`, { method: 'DELETE' });
        carregarTabela();
    }
}

window.onload = () => {
    carregarInstrutores();
    carregarTabela();
};