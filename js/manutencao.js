const API_MANUTENCOES = "https://icjardimacessivel.onrender.com/api/manutencoes";
const API_JARDINS = "https://icjardimacessivel.onrender.com/api/jardins";

const formCadastro = document.getElementById("formCadastro");
const formPesquisa = document.getElementById("formPesquisa");
const listaManutencoesDiv = document.getElementById("listaManutencoes");
const selectJardim = document.getElementById("jardim");
const btnSubmit = formCadastro.querySelector("button[type='submit']");

const secaoCadastroManutencao = formCadastro.closest(".cadastro");
const btnNovaManutencao = document.getElementById("btnNovaManutencao");

let manutencaoEmEdicaoId = null;
let mapaJardins = {};

if (btnNovaManutencao) {
    btnNovaManutencao.addEventListener("click", () => {
        manutencaoEmEdicaoId = null;
        formCadastro.reset();
        btnSubmit.textContent = "Confirmar Registro";

        carregarSelectJardins();

        if (secaoCadastroManutencao) {
            secaoCadastroManutencao.hidden = false;
            secaoCadastroManutencao.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ======================================================
// 1. CARREGAR OS JARDINS NO SELECT
// ======================================================
async function carregarSelectJardins() {
    try {
        if (selectJardim) selectJardim.setAttribute("aria-busy", "true");

        const resposta = await fetch(API_JARDINS);
        if (!resposta.ok) throw new Error("Erro ao buscar jardins");

        const listaJardins = await resposta.json();

        selectJardim.innerHTML = "<option value=''>Selecione um jardim...</option>";
        mapaJardins = {};

        if (!listaJardins || listaJardins.length === 0) {
            selectJardim.innerHTML = "<option value=''>Nenhum jardim cadastrado</option>";
            return;
        }

        listaJardins.forEach(jardim => {
            mapaJardins[jardim.id] = jardim.nome;

            const option = document.createElement("option");
            option.value = jardim.id;
            option.textContent = jardim.nome;
            selectJardim.appendChild(option);
        });
    } catch (erro) {
        console.error("Erro ao carregar select de jardim:", erro);
        selectJardim.innerHTML = "<option value=''>Erro ao carregar dados do jardim</option>";
    } finally {
        if (selectJardim) selectJardim.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 2. LISTAR AS MANUTENÇÕES DO BANCO
// ======================================================
async function carregarManutencoes(termoPesquisa = "") {
    try {
        if (listaManutencoesDiv) listaManutencoesDiv.setAttribute("aria-busy", "true");

        const resposta = await fetch(API_MANUTENCOES);
        if (!resposta.ok) throw new Error("Erro ao buscar manutenções");

        let manutencoes = await resposta.json();
        listaManutencoesDiv.innerHTML = "";

        if (termoPesquisa) {
            const termo = termoPesquisa.toLowerCase().trim();
            manutencoes = manutencoes.filter(m =>
                (m.descricao && m.descricao.toLowerCase().includes(termo))
            );
        }

        if (manutencoes.length === 0) {
            listaManutencoesDiv.innerHTML = "<p class='mensagem-status'>Nenhuma manutenção registrada.</p>";
            return;
        }

        manutencoes.forEach(manutencao => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "planta-item";

            let dataFormatada = manutencao.dataRegistro;
            if (manutencao.dataRegistro && manutencao.dataRegistro.includes("-")) {
                const partes = manutencao.dataRegistro.split("-");
                dataFormatada = `${partes[2]}/${partes[1]}/${partes[0]}`;
            }

            const nomeJardim = mapaJardins[manutencao.jardimId] || "Jardim Desconhecido";
            const dadosJson = JSON.stringify(manutencao).replace(/"/g, '&quot;');

            itemDiv.innerHTML = `
                <div class="item-conteudo">
                    <strong>${nomeJardim}</strong> - <span>(${dataFormatada || 'Sem data'})</span>
                    <small class="item-subtexto">Procedimento: ${manutencao.descricao}</small>
                </div>
                <div class="acoes">
                    <button type="button" class="btn-editar" onclick="prepararEdicao(${dadosJson})" aria-label="Editar manutenção de ${nomeJardim} em ${dataFormatada || 'sem data'}">Editar</button>
                    <button type="button" class="btn-excluir" onclick="excluirManutencao(${manutencao.id})" aria-label="Excluir manutenção de ${nomeJardim} em ${dataFormatada || 'sem data'}">Excluir</button>
                </div>
            `;
            listaManutencoesDiv.appendChild(itemDiv);
        });

    } catch (erro) {
        console.error("Erro ao carregar manutenções:", erro);
        listaManutencoesDiv.innerHTML = "<p class='mensagem-erro' role='alert'>Erro ao carregar dados do servidor.</p>";
    } finally {
        if (listaManutencoesDiv) listaManutencoesDiv.setAttribute("aria-busy", "false");
    }
}

// ======================================================
// 3. PREPARAR EDIÇÃO
// ======================================================
function prepararEdicao(manutencao) {
    document.getElementById("data").value = manutencao.dataRegistro || "";
    document.getElementById("descricao").value = manutencao.descricao || "";

    if (manutencao.jardimId) {
        selectJardim.value = manutencao.jardimId;
    }

    manutencaoEmEdicaoId = manutencao.id;
    btnSubmit.textContent = "Salvar Alterações";

    if (secaoCadastroManutencao) {
        secaoCadastroManutencao.hidden = false;
        secaoCadastroManutencao.scrollIntoView({ behavior: 'smooth' });
    }
}

// ======================================================
// 4. SALVAR OU ALTERAR (POST / PUT)
// ======================================================
formCadastro.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!selectJardim.value) {
        alert("Erro: É obrigatório associar a manutenção a um jardim de origem.");
        return;
    }

    const dadosManutencao = {
        id: manutencaoEmEdicaoId ? manutencaoEmEdicaoId : null,
        dataRegistro: document.getElementById("data").value,
        descricao: document.getElementById("descricao").value.trim(),
        jardimId: parseInt(selectJardim.value)
    };

    try {
        formCadastro.setAttribute("aria-busy", "true");
        const url = manutencaoEmEdicaoId ? `${API_MANUTENCOES}/${manutencaoEmEdicaoId}` : API_MANUTENCOES;
        const metodo = manutencaoEmEdicaoId ? "PUT" : "POST";

        const resposta = await fetch(url, {
            method: metodo,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dadosManutencao)
        });

        if (resposta.ok) {
            alert(manutencaoEmEdicaoId ? "Registro de manutenção alterado com sucesso!" : "Manutenção registrada com sucesso!");
            formCadastro.reset();
            manutencaoEmEdicaoId = null;
            btnSubmit.textContent = "Confirmar Registro";

            if (secaoCadastroManutencao) {
                secaoCadastroManutencao.hidden = true;
            }

            await carregarSelectJardins();
            carregarManutencoes();
        } else {
            alert("Erro ao processar dados no servidor. Verifique se as informações estão preenchidas corretamente.");
        }
    } catch (erro) {
        alert("Erro de conexão com o servidor.");
    } finally {
        formCadastro.setAttribute("aria-busy", "false");
    }
});

// ======================================================
// 5. EXCLUIR
// ======================================================
async function excluirManutencao(id) {
    if (!confirm("Tem certeza que deseja apagar este registro de manutenção?")) return;

    try {
        const reply = await fetch(`${API_MANUTENCOES}/${id}`, { method: "DELETE" });
        if (reply.ok) {
            alert("Registro de manutenção excluído com sucesso!");
            carregarManutencoes();
        } else {
            alert("Erro ao tentar excluir a manutenção.");
        }
    } catch (erro) {
        console.error("Erro ao excluir:", erro);
    }
}

formPesquisa.addEventListener("submit", function (event) {
    event.preventDefault();
    carregarManutencoes(document.getElementById("pesquisa").value.trim());
});

async function inicializar() {
    if (secaoCadastroManutencao) {
        secaoCadastroManutencao.hidden = true;
    }
    await carregarSelectJardins();
    await carregarManutencoes();
}
inicializar();
