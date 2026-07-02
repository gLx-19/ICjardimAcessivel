// URL da API principal de Tarefas
const API_URL = "http://localhost:8080/api/tarefas";

const formCadastro = document.getElementById("formCadastro");
const listaTarefasDiv = document.getElementById("listaTarefas");

// ======================================================
// 1. CARREGAR/LISTAR TAREFAS DO BANCO
// ======================================================
async function carregarTarefas() {
    try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao buscar tarefas");
        
        const tarefas = await resposta.json();

        // Limpa a lista visual antes de preencher
        listaTarefasDiv.innerHTML = "";

        if (tarefas.length === 0) {
            listaTarefasDiv.innerHTML = "<p>Nenhuma tarefa cadastrada no momento.</p>";
            return;
        }

        // Desenha cada tarefa na tela
        tarefas.forEach(tarefa => {
            // Se concluida for true, mostra check. Se false, pendente.
            const statusTexto = tarefa.concluida ? "✅ Concluída" : "⏳ Pendente";
            
            const tarefaCard = document.createElement("div");
            tarefaCard.className = "planta-item"; 
            tarefaCard.innerHTML = `
                <div style="margin-bottom: 10px;">
                    <strong>📋 ${tarefa.titulo || 'Tarefa'}</strong> - ${statusTexto}<br>
                    <em>Prazo: ${tarefa.dataPrevista || 'Sem data definida'}</em><br>
                    <p style="margin-top: 5px;">${tarefa.descricao || ''}</p>
                </div>
                <div class="acoes">
                    ${!tarefa.concluida ? `<button class="btn-ver" onclick="concluirTarefa(${tarefa.id})">✔ Concluir</button>` : ''}
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
// 2. ENVIAR CADASTRO PARA O BANCO DE DADOS
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault(); 

    // Pega o status do HTML e converte para true/false para o Java
    const statusSelecionado = document.getElementById("status").value;
    const isConcluida = (statusSelecionado === "Concluída");

    const dadosDaTarefa = {
        titulo: "Tarefa de Manutenção", // O Java exige título, enviando um padrão
        descricao: document.getElementById("descricao").value,
        dataPrevista: document.getElementById("prazo").value,
        concluida: isConcluida
    };

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosDaTarefa)
        });

        if (resposta.ok) {
            alert("✅ Tarefa cadastrada com sucesso!");
            formCadastro.reset();
            carregarTarefas(); // Atualiza a lista na hora
        } else {
            alert("❌ Erro ao cadastrar tarefa. Verifique os dados.");
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("🔌 Erro de conexão com o servidor!");
    }
});

// ======================================================
// 3. MARCAR TAREFA COMO CONCLUÍDA
// ======================================================
async function concluirTarefa(id) {
    try {
        // Usa a rota PATCH que a sua dupla criou no Controller
        const resposta = await fetch(`${API_URL}/${id}/concluir`, {
            method: "PATCH"
        });

        if (resposta.ok) {
            carregarTarefas(); // Atualiza a tela
        } else {
            alert("Erro ao tentar concluir a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao concluir:", erro);
    }
}

// ======================================================
// 4. EXCLUIR TAREFA
// ======================================================
async function excluirTarefa(id) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
        return; 
    }

    try {
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (resposta.ok) {
            carregarTarefas(); // Atualiza a tela
        } else {
            alert("Erro ao excluir a tarefa.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

// Executa a listagem assim que abre a página
carregarTarefas();