$(document).ready(function () {
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    } else {
        let cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        let partes = cliente.nome.split(' ');
        let primeiroNome = partes[0];
        $("#nome").text(primeiroNome);
        atualizarTabela(cliente.id);
    }
})

async function atualizarTabela(clienteId) {
    let corpo = document.querySelector("#tabela tbody");
    corpo.innerHTML = "";
    try {
        let resposta = await fetch("https://api-banco.odiloncorrea.com/contas?clienteId=" + clienteId);
        let contas = await resposta.json();
        contas.forEach(conta => {
            let novaLinha = corpo.insertRow();
            novaLinha.insertCell(0).innerText = conta.numero
            novaLinha.insertCell(1).innerText = formatarMoeda(conta.saldo);
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao consultar contas.");
    }
}

async function criarConta() {
    let cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));

    try {
        // gera número único
        let numeroConta = await gerarNumeroContaUnico();

        // monta o objeto da conta
        let conta = {
            numero: numeroConta,
            saldo: 0,
            clienteId: cliente.id
        };

        // faz o POST
        let resposta = await fetch("https://api-banco.odiloncorrea.com/contas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(conta)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao criar conta");
        }

        let resultado = await resposta.json();

        console.log("Conta criada:", resultado);

        iniciarSessao();

        alert("Conta criada com sucesso!");

        // opcional: atualizar tabela ou saldo
        atualizarTabela(cliente.id);

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao criar conta.");
    }
}

async function gerarNumeroContaUnico() {
    let cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));

    // pega iniciais 
    let iniciais = cliente.nome.trim().slice(0, 2).toUpperCase();

    let numeroConta;
    let existe = true;

    while (existe) {
        // gera número aleatório de 6 dígitos
        let numeroAleatorio = Math.floor(100000 + Math.random() * 900000);

        numeroConta = `${iniciais}-${numeroAleatorio}`;

        try {
            let resposta = await fetch(`https://api-banco.odiloncorrea.com/contas/existe?numero=${numeroConta}`);
            existe = await resposta.json(); // true ou false
        } catch (erro) {
            console.error("Erro ao verificar conta:", erro);
            throw erro;
        }
    }

    return numeroConta;
}

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

