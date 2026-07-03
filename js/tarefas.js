const API_TAREFAS = "http://localhost:8080/api/tarefas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTarefasDiv = document.getElementById("listaTarefas");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

// Captura a seção inteira do formulário para controlar a exibição (display: none/block)
const secaoCadastroTarefa = formCadastro.closest(".cadastro");
const btnNovaTarefa = document.getElementById("btnNovaTarefa"); 

let tarefaEmEdicaoId = null;

// Controla a abertura do formulário para uma NOVA tarefa (Igual ao da Tag)
if (btnNovaTarefa) {
    btnNovaTarefa.addEventListener("click", () => {
        tarefaEmEdicaoId = null;
        formCadastro.reset();
        document.getElementById("status").value = "Pendente";
        const tituloForm = document.getElementById("tituloFormulario");
        if (tituloForm) tituloForm.innerText = "Cadastrar Nova Tarefa";
        btnSubmit.textContent = "Confirmar Cadastro";
        
        if (secaoCadastroTarefa) {
            secaoCadastroTarefa.style.display = "block";
            secaoCadastroTarefa.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR E LISTAR TAREFAS
// ======================================================
async function carregarTarefas(termoPesquisa = "") {
    try {
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
            listaTarefasDiv.innerHTML = "<p>Nenhuma tarefa cadastrada.</p>";
            return;
        }

        tarefas.forEach(tarefa => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            let prazoFormatado = tarefa.prazo;
            if (tarefa.prazo && tarefa.prazo.includes("-")) {
                const partes = tarefa.prazo.split("-");
                prazoFormatado = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const statusIcone = tarefa.status === "Concluída" ? "✅" : "⏳";

            itemDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <span>
                        ${statusIcone} <strong>${tarefa.titulo}</strong> - <small>Prazo: ${prazoFormatado}</small>
                        <br><small style="color: #666;">${tarefa.descricao}</small>
                    </span>
                    <div class="acoes">
                        ${tarefa.status !== "Concluída" ? `<button class="btn-ver" onclick="concluirTarefa(${tarefa.id})">✔️ Concluir</button>` : ''}
                        <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(tarefa).replace(/"/g, '&quot;')})" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px;">✏️ Editar</button>
                        <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">🗑️ Excluir</button>
                    </div>
                </div>
            `;
            listaTarefasDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar tarefas:", erro);
        listaTarefasDiv.innerHTML = "<p style='color:red;'>Erro ao carregar dados do servidor.</p>";
    }
}

// ======================================================
// 2. PREPARAR EDIÇÃO (MOSTRA O FORMULÁRIO DINAMICAMENTE)
// ======================================================
function prepararEdicao(tarefa) {
    document.getElementById("titulo").value = tarefa.titulo || "";
    document.getElementById("descricao").value = tarefa.descricao || "";
    document.getElementById("prazo").value = tarefa.prazo || "";
    document.getElementById("status").value = tarefa.status || "Pendente";

    const tituloForm = document.getElementById("tituloFormulario");
    if (tituloForm) tituloForm.innerText = "Editar Detalhes da Tarefa";
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    if (secaoCadastroTarefa) {
        secaoCadastroTarefa.style.display = "block";
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
        prazo: document.getElementById("prazo").value,
        status: document.getElementById("status").value
    };

    try {
        const url = tarefaEmEdicaoId ? `${API_TAREFAS}/${tarefaEmEdicaoId}` : API_TAREFAS;
        const metodo = tarefaEmEdicaoId ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosTarefa)
        });

        if (resposta.ok) {
            alert(tarefaEmEdicaoId ? "✅ Tarefa atualizada com sucesso!" : "✅ Nova tarefa criada com sucesso!");
            formCadastro.reset();
            tarefaEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Cadastro";
            
            const tituloForm = document.getElementById("tituloFormulario");
            if (tituloForm) tituloForm.innerText = "Cadastrar Nova Tarefa";

            // ESCONDE O FORMULÁRIO DE NOVO APÓS SALVAR (IGUAL AO DA TAG)
            if (secaoCadastroTarefa) {
                secaoCadastroTarefa.style.display = "none";
            }
            
            carregarTarefas();
        } else {
            alert("❌ Erro ao salvar dados no servidor. Verifique as informações obrigatórias.");
        }
    } catch (erro) {
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 4. MARCAR COMO CONCLUÍDA (PATCH)
// ======================================================
async function concluirTarefa(id) {
    try {
        const resposta = await fetch(`${API_TAREFAS}/${id}/concluir`, { method: "PATCH" });
        if (resposta.ok) {
            alert("✅ Tarefa concluída com sucesso!");
            carregarTarefas();
        } else {
            alert("❌ Falha ao atualizar o status da tarefa.");
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
            alert("🗑️ Tarefa removida com sucesso!");
            carregarTarefas();
        } else {
            alert("❌ Erro ao excluir a tarefa.");
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
        secaoCadastroTarefa.style.display = "none";
    }
    await carregarTarefas();
}
inicializar();