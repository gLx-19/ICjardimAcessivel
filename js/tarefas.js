const API_TAREFAS = "https://icjardimacessivel.onrender.com/api/tarefas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTarefasDiv = document.getElementById("listaTarefas");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

const secaoCadastroTarefa = formCadastro.closest(".cadastro");
const btnNovaTarefa = document.getElementById("btnNovaTarefa");

let tarefaEmEdicaoId = null;

if (btnNovaTarefa) {
    btnNovaTarefa.addEventListener("click", () => {
        tarefaEmEdicaoId = null;
        formCadastro.reset();
        document.getElementById("status").value = "Pendente";
        const tituloForm = document.getElementById("tituloFormulario");
        if (tituloForm) tituloForm.innerText = "Cadastrar Nova Tarefa";
        btnSubmit.textContent = "Confirmar Cadastro";

        if (secaoCadastroTarefa) {
            secaoCadastroTarefa.hidden = false;
            secaoCadastroTarefa.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR E LISTAR TAREFAS
// ======================================================
async function carregarTarefas(termoPesquisa = "") {
    try {
        if (listaTarefasDiv) listaTarefasDiv.setAttribute("aria-busy", "true");

        const resposta = await fetch(API_TAREFAS);
        if (!resposta.ok) throw new Error("Erro ao buscar tarefas");

        let tarefas = await resposta.json();
        listaTarefasDiv.innerHTML = "";

        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase().trim();
            tarefas = tarefas.filter(t =>
                (t.titulo && t.titulo.toLowerCase().includes(termo)) ||
                (t.descricao && t.descricao.toLowerCase().includes(termo))
            );
        }

        if (tarefas.length === 0) {
            listaTarefasDiv.innerHTML = "<p class='mensagem-status'>Nenhuma tarefa cadastrada.</p>";
            return;
        }

        tarefas.forEach(tarefa => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            let prazoFormatado = tarefa.dataPrevista || tarefa.prazo;
            if (prazoFormatado && prazoFormatado.includes("-")) {
                const partes = prazoFormatado.split("-");
                prazoFormatado = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const statusTexto = tarefa.status === "Concluída" ? "Concluída" : "Pendente";
            const tituloTarefa = tarefa.titulo || "Tarefa sem título";
            const dadosJson = JSON.stringify(tarefa).replace(/"/g, '&quot;');

            itemDiv.innerHTML = `
                <div class="item-conteudo">
                    <strong>[${statusTexto}] ${tituloTarefa}</strong> - <small class="item-localizacao">Prazo: ${prazoFormatado || 'Sem data'}</small>
                    <small class="item-subtexto">${tarefa.descricao || ''}</small>
                </div>
                <div class="acoes">
                    ${tarefa.status !== "Concluída" ? `<button type="button" class="btn-ver" onclick="concluirTarefa(${tarefa.id})" aria-label="Concluir tarefa ${tituloTarefa}">Concluir</button>` : ''}
                    <button type="button" class="btn-editar" onclick="prepararEdicao(${dadosJson})" aria-label="Editar tarefa ${tituloTarefa}">Editar</button>
                    <button type="button" class="btn-excluir" onclick="excluirTarefa(${tarefa.id})" aria-label="Excluir tarefa ${tituloTarefa}">Excluir</button>
                </div>
            `;
            listaTarefasDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
        listaTarefasDiv.innerHTML = "<p class='mensagem-erro' role='alert'>Erro ao carregar dados do servidor.</p>";
    } finally {
        if (listaTarefasDiv) listaTarefasDiv.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 2. PREPARAR EDIÇÃO
// ======================================================
function prepararEdicao(tarefa) {
    tarefaEmEdicaoId = tarefa.id;

    document.getElementById("titulo").value = tarefa.titulo || "";
    document.getElementById("descricao").value = tarefa.descricao || "";
    document.getElementById("prazo").value = tarefa.dataPrevista || tarefa.prazo || "";
    document.getElementById("status").value = tarefa.status || "Pendente";

    const tituloForm = document.getElementById("tituloFormulario");
    if (tituloForm) tituloForm.innerText = "Editar Detalhes da Tarefa";
    btnSubmit.textContent = "Salvar Alterações";

    if (secaoCadastroTarefa) {
        secaoCadastroTarefa.hidden = false;
        secaoCadastroTarefa.scrollIntoView({ behavior: 'smooth' });
    }
}

// ======================================================
// 3. SALVAR OU ALTERAR TAREFA (POST / PUT)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    const dadosTarefa = {
        id: tarefaEmEdicaoId ? tarefaEmEdicaoId : null,
        titulo: document.getElementById("titulo").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        dataPrevista: document.getElementById("prazo").value,
        status: document.getElementById("status").value
    };

    try {
        formCadastro.setAttribute("aria-busy", "true");
        const url = tarefaEmEdicaoId ? `${API_TAREFAS}/${tarefaEmEdicaoId}` : API_TAREFAS;
        const metodo = tarefaEmEdicaoId ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosTarefa)
        });

        if (resposta.ok) {
            alert(tarefaEmEdicaoId ? "Tarefa atualizada com sucesso!" : "Nova tarefa criada com sucesso!");
            formCadastro.reset();
            tarefaEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";

            const tituloForm = document.getElementById("tituloFormulario");
            if (tituloForm) tituloForm.innerText = "Cadastrar Nova Tarefa";

            if (secaoCadastroTarefa) {
                secaoCadastroTarefa.hidden = true;
            }

            carregarTarefas();
        } else {
            alert("Erro ao salvar dados no servidor. Verifique as informações obrigatórias.");
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    } finally {
        formCadastro.setAttribute("aria-busy", "false");
    }
});

// ======================================================
// 4. MARCAR COMO CONCLUÍDA (PATCH)
// ======================================================
async function concluirTarefa(id) {
    try {
        const resposta = await fetch(`${API_TAREFAS}/${id}/concluir`, { method: "PATCH" });
        if (resposta.ok) {
            alert("Tarefa concluída com sucesso!");
            carregarTarefas();
        } else {
            alert("Falha ao atualizar o status da tarefa.");
        }
    } catch (erro) {
        console.error(erro);
    }
}

// ======================================================
// 5. EXCLUIR TAREFA
// ======================================================
async function excluirTarefa(id) {
    if (!confirm("Deseja realmente remover esta tarefa do painel?")) return;

    try {
        const resposta = await fetch(`${API_TAREFAS}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            alert("Tarefa removida com sucesso!");
            carregarTarefas();
        } else {
            alert("Erro ao excluir a tarefa.");
        }
    } catch (erro) {
        console.error(erro);
    }
}

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    carregarTarefas(document.getElementById("pesquisa").value);
});

// Inicialização segura
async function inicializar() {
    if (secaoCadastroTarefa) {
        secaoCadastroTarefa.hidden = true;
    }
    await carregarTarefas();
}
inicializar();
