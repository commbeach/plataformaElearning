document.addEventListener("DOMContentLoaded", async () => {
    // 1. Pega o ID do curso da URL (Ex: Assistir?id=123)
    const urlParams = new URLSearchParams(window.location.search);
    const cursoId = urlParams.get('id');

    if (!cursoId) {
        alert("Curso não encontrado!");
        window.location.href = "/GerenciarCursos";
        return;
    }

    try {
        const response = await fetch(`/cursos/${cursoId}`);
        const curso = await response.json();

        renderizarPlayer(curso);
    } catch (error) {
        console.error("Erro ao carregar curso:", error);
    }
});

function renderizarPlayer(curso) {
    document.getElementById('cursoTitulo').innerText = curso.titulo;
    document.getElementById('instrutorNome').innerText = "Instrutor: " + (curso.instrutorId?.nomInstrutor || "Não informado");

    const playlist = document.getElementById('playlist');
    playlist.innerHTML = "";

    curso.modulos.sort((a, b) => a.ordem - b.ordem).forEach((modulo, indexMod) => {
        // Cabeçalho do Módulo
        const modHeader = document.createElement("div");
        modHeader.className = "modulo-header p-2 border-bottom border-top";
        modHeader.innerText = `Módulo ${indexMod + 1}: ${modulo.titulo}`;
        playlist.appendChild(modHeader);

        // Aulas do Módulo
        modulo.aulas.sort((a, b) => a.ordem - b.ordem).forEach(aula => {
            const aulaItem = document.createElement("div");
            aulaItem.className = "aula-link p-3 border-bottom text-dark d-flex align-items-center";
            aulaItem.innerHTML = `<i class="bi bi-play-circle me-2"></i> ${aula.titulo}`;
            
            aulaItem.onclick = () => carregarVideo(aula, aulaItem);
            playlist.appendChild(aulaItem);
        });
    });

    // Carregar primeira aula automaticamente se existir
    if (curso.modulos[0]?.aulas[0]) {
        const primeiraAula = curso.modulos[0].aulas[0];
        carregarVideo(primeiraAula, playlist.querySelector('.aula-link'));
    }
}

function carregarVideo(aula, elementoHtml) {
    // Atualizar UI
    document.querySelectorAll('.aula-link').forEach(el => el.classList.remove('active'));
    elementoHtml.classList.add('active');

    document.getElementById('aulaTitulo').innerText = aula.titulo;
    document.getElementById('aulaDescricao').innerText = aula.descricao || "";

    const player = document.getElementById('videoPlayer');
    
    // Lógica para converter link do YouTube em Embed se necessário
    let url = aula.videoUrl;
    if (url.includes("youtube.com/watch?v=")) {
        url = url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
        url = url.replace("youtu.be/", "youtube.com/embed/");
    }

    player.src = url;
}