const API_URL = "http://localhost:8080/api/tarefas";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaTarefasDiv = document.getElementById("listaTarefas");
const btnSubmit = formCadastro.querySelector("button[type='submit']");
const tituloFormulario = document.getElementById("tituloFormulario");

let tarefaEmEdicaoId = null;

// ======================================================
// 1. CARREGAR/LISTAR TAREFAS (COM SUPORTE A FILTRO)
// ======================================================
async function carregarTarefas(termoPesquisa = "") {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao buscar tarefas");
        
        let tarefas = await resposta.json();
        listaTarefasDiv.innerHTML = "";

        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase();
            tarefas = tarefas.filter(t => 
                (t.titulo && t.titulo.toLowerCase().includes(termo)) ||
                (t.descricao && t.descricao.toLowerCase().includes(termo))
            );
        }

        if (tarefas.length === 0) {
            listaTarefasDiv.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
            return;
        }

        tarefas.forEach(tarefa => {
            const statusTexto = tarefa.concluida ? "✅ Concluída" : "⏳ Pendente";
            
            // Formatando a exibição da data
            let dataFormatada = tarefa.dataPrevista || 'Sem data';
            if (tarefa.dataPrevista && tarefa.dataPrevista.includes("-")) {
                const partes = tarefa.dataPrevista.split("-");
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const tarefaCard = document.createElement("div");
            tarefaCard.className = "planta-item"; 
            tarefaCard.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>📋 ${tarefa.titulo || 'Tarefa'}</strong> - <small>${statusTexto}</small><br>
                    <em>Prazo: ${dataFormatada}</em><br>
                    <p style="margin-top: 5px; color: #555;">${tarefa.descricao || ''}</p>
                </div>
                <div class="acoes">
                    ${!tarefa.concluida ? `<button class="btn-ver" onclick="concluirTarefa(${tarefa.id})">✔ Concluir</button>` : ''}
                    <button class="btn-editar" onclick="prepararEdicao(${JSON.stringify(tarefa).replace(/"/g, '&quot;')})" style="background-color: #ffc107; color: black;">✏️ Editar</button>
                    <button class="btn-excluir" onclick="excluirTarefa(${tarefa.id})">🗑 Excluir</button>
                </div>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 15px 0;">
            `;
            listaTarefasDiv.appendChild(tarefaCard);
        });

    } catch (erro) {
        console.error("Erro ao carregar lista:", erro);
        listaTarefasDiv.innerHTML = "<p style='color:red;'>Erro ao carregar tarefas.</p>";
    }
}

// ======================================================
// 2. PREPARAR EDIÇÃO (Puxa os dados para o formulário)
// ======================================================
function prepararEdicao(tarefa) {
    document.getElementById("titulo").value = tarefa.titulo || "";
    document.getElementById("descricao").value = tarefa.descricao || "";
    document.getElementById("prazo").value = tarefa.dataPrevista || "";
    document.getElementById("status").value = tarefa.concluida ? "Concluída" : "Pendente";

    tarefaEmEdicaoId = tarefa.id;
    tituloFormulario.textContent = "✏️ Editando Tarefa";
    btnSubmit.textContent = "💾 Salvar Alterações";
    
    formCadastro.scrollIntoView({ behavior: 'smooth' });
}

// ======================================================
// 3. SALVAR OU ATUALIZAR TAREFA (POST / PUT)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    const statusSelecionado = document.getElementById("status").value;
    const isConcluida = (statusSelecionado === "Concluída");

    const dadosDaTarefa = {
        titulo: document.getElementById("titulo").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        dataPrevista: document.getElementById("prazo").value,
        concluida: isConcluida
    };

    try {
        let resposta;
        const url = tarefaEmEdicaoId ? `${API_URL}/${tarefaEmEdicaoId}` : API_URL;
        const metodo = tarefaEmEdicaoId ? "PUT" : "POST";

        resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosDaTarefa)
        });

        if (resposta.ok) {
            alert(tarefaEmEdicaoId ? "✅ Tarefa atualizada com sucesso!" : "✅ Tarefa cadastrada com sucesso!");
            
            formCadastro.reset();
            tarefaEmEdicaoId = null;
            tituloFormulario.textContent = "Cadastrar Nova Tarefa";
            btnSubmit.textContent = "Confirmar Cadastro";
            
            carregarTarefas(); 
        } else {
            alert("❌ Erro ao salvar tarefa. Verifique as informações fornecidas.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 4. ROTA PATCH: CONCLUIR RÁPIDO PELO BOTÃO
// ======================================================
async function concluirTarefa(id) {
    try {
        const resposta = await fetch(`${API_URL}/${id}/concluir`, { method: "PATCH" });
        if (resposta.ok) {
            carregarTarefas(); 
        } else {
            alert("Erro ao tentar concluir a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao concluir:", erro);
    }
}

// ======================================================
// 5. EXCLUIR TAREFA
// ======================================================
async function excluirTarefa(id) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return; 

    try {
        const resposta = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        if (resposta.ok) {
            carregarTarefas(); 
        } else {
            alert("Erro ao excluir a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// ======================================================
// 6. FILTRO DE BUSCA
// ======================================================
formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    carregarTarefas(document.getElementById("pesquisa").value.trim());
});

carregarTarefas();