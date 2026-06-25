let timerId;
let tempoRestante = 60;

$(document).ready(function () {
    iniciarSessao();
})

function iniciarSessao() {
    tempoRestante = 60;

    if (timerId) {
        clearTimeout(timerId);
    }

    // Atualiza a exibição inicial
    atualizarDisplay(tempoRestante);

    timerId = setInterval(() => {
        tempoRestante--;

        if (tempoRestante <= 0) {
            clearInterval(timerId);
            alert("Sua sessão expirou. Por favor, faça login novamente.");
            window.location.href = "login.html";
        } else {
            atualizarDisplay(tempoRestante);
        }
    }, 1000);
}


function atualizarDisplay(segundosTotais) {
    // Calcula minutos e segundos restantes
    let minutos = Math.floor(segundosTotais / 60);
    let segundos = segundosTotais % 60;

    // Formata para ter sempre dois dígitos (ex: 01:05)
    let formatado = String(minutos).padStart(2, '0') + ":" + String(segundos).padStart(2, '0');

    // Joga o valor para dentro do span no HTML
    $("#tempo").text(formatado);
}