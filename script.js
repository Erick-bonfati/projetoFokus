const html = document.querySelector('html');
const focoBtn = document.querySelector('.app__card-button--foco');
const curtoBtn = document.querySelector('.app__card-button--curto');
const longoBtn = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title')
const botaoIniciar = document.querySelector('.app__card-primary-button');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iconePausar = document.querySelector('.app__card-primary-butto-icon')
const displayTempo = document.querySelector('#timer');

const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('/sons/luna-rise-part-one.mp3') // exportando a música no JS
musica.loop = true // repete a música infinitas vezes

let tempoDecorridoEmSegundos = 1500;
let intervaloId = null

const musicaIniciar =  new Audio('/sons/play.wav');
const musicaPausar = new Audio('/sons/pause.mp3');
const musicaFinalizar =  new Audio('/sons/beep.mp3');

musicaFocoInput.addEventListener('change', () => { // condicão para caso a música estiver pausada ele vai tocar ou pausar
  if(musica.paused) {
    musica.play()
  } else {
    musica.pause()
  }
})

focoBtn.addEventListener('click', () => { // captura o evento de clique do focobotao
  tempoDecorridoEmSegundos = 1500;
  alterarContexto('foco') // esse é o parametro do contexto que vai ser adicionado na nossa funcao
  focoBtn.classList.add('active');
})

curtoBtn.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 300;
  alterarContexto('descanso-curto')
  curtoBtn.classList.add('active');
})

longoBtn.addEventListener('click', () => {
  tempoDecorridoEmSegundos = 900;
  alterarContexto('descanso-longo')
  longoBtn.classList.add('active');
});

function alterarContexto(contexto) {
  mostrarTempo();
  botoes.forEach(function (contexto) { // esse método faz com que remova todas as classes active dependendo do contexto
    contexto.classList.remove('active') // se o contexto foco estiver seleciono, os outros vão ficam sem a classe "active"
  })
  html.setAttribute('data-contexto', contexto) // aplica o estilo '...' com base no "data-contexto"
  banner.setAttribute('src', `/imagens/${contexto}.png`) // atribuitto ao banner a imagem que estamos retribuindo
  switch (contexto) { // aqui vamos passar o texto de cada contexto
    //selecionando o contexto, ex: 'foco'
    case "foco":
      titulo.innerHTML = `
      Otimize sua produtividade,<br> <strong class="app__title-strong">mergulhe no que importa.</strong>
      ` //innerHTML para adicionar este texto no HTML
      break;

     case "descanso-curto":
      titulo.innerHTML = `
      Que tal dar uma respirada? <br> <strong class="app__title-strong">Faça uma pausa curta!</strong>
      `
      break;

      case "descanso-longo":
      titulo.innerHTML = `
      Hora de voltar à superfície.<br> <strong class="app__title-strong">Faça uma pausa longa.</strong>
      ` 
      break;

    default:
      break;  
  }
}

const contagemRegressiva = () => { // vai diminuindo de 1 em 1 segundo a cada loop
  if(tempoDecorridoEmSegundos <= 0) { // se o tempo chegar a zero, ele finaliza a repetição
    musicaFinalizar.play();
    alert('Tempo finalizado!');
    const focoAtivo = html.getAttribute('data-contexto') == 'foco' // se eu estou com o foco ativo, ai sim podemos dizer que a tarefa foi
    // finalizada
    if(focoAtivo) {
      const evento = new CustomEvent('FocoFinalizado') // aqui estamos criando um evento personalizado
      document.dispatchEvent(evento) // disparando o evento de focoFinalizado
    }
    zerar();
    return
  }
  tempoDecorridoEmSegundos -= 1
  mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
  if(intervaloId) { //se existir valor no intervaloId, ele vai executar a funcao zerar(), que serve para parar o setInterval
    musicaPausar.play()
    zerar()
    return;
  }
  iconePausar.setAttribute('src', `/imagens/pause.png`)
  musicaIniciar.play();
  intervaloId = setInterval(contagemRegressiva, 1000) //pede a condição e de quanto em quanto tempo vamos executar nossa funcão
  iniciarOuPausarBt.textContent = "Pausar"; //troca o nome do texto
}

function zerar() { // zera o setInterval, para quando o temporizador chegar a zero, o intervalId passa a ser 'null' novamente
  clearInterval(intervaloId)
  iconePausar.setAttribute('src', `/imagens/play_arrow.png`)
  iniciarOuPausarBt.textContent = "Começar";
  intervaloId = null
}

function mostrarTempo() {
  const tempo = new Date(tempoDecorridoEmSegundos * 1000) // formata o tempo para milissegundos
  const tempoFormatado = tempo.toLocaleString('pt-BR', { minute: '2-digit', second: '2-digit'}) // formata o tempo para, ex: 10:00
  displayTempo.innerHTML = `${tempoFormatado}`
}

mostrarTempo();