$(document).ready(function () {
    if (!localStorage.clienteAutenticado) {
        alert("Acesso negado.");
        window.location.href = "login.html";
    } else {
        let cliente = JSON.parse(localStorage.getItem('clienteAutenticado'));
        let partes = cliente.nome.split(' ');
        let primeiroNome = partes[0];
        $("#nome").text(primeiroNome);
        atualizarSaldo(cliente.id);
    }

})

async function atualizarSaldo(clienteId) {
    let saldo = 0;

    try {
        let resposta = await fetch("https://api-banco.odiloncorrea.com/contas?clienteId=" + clienteId);
        let contas = await resposta.json();
        contas.forEach(conta => {
            saldo += conta.saldo;
        });

    } catch (erro) {
        console.error("Erro:", erro);
        alert("Erro ao consultar contas.");
    }

    const texto = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(saldo);

    $("#saldo").text(texto);

}

