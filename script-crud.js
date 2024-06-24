
// Aqui começamos por selecionar os elementos que vamos precisar interagir no nosso código.
// Esta linha pega o botão de adicionar tarefa baseado na classe CSS.
const btnAdicionarTarefa = document.querySelector('.app__button--add-task');

// Da mesma forma, esta linha seleciona nosso formulário de adicionar tarefa.
const formAdicionarTarefa = document.querySelector('.app__form-add-task');

// E aqui, pegamos a área de texto onde o usuário digita a descrição da tarefa.
const textarea = document.querySelector('.app__form-textarea');

//Aqui nos colocamos um seletor para buscar pela Ul que cria as tarefas
const ulTarefas = document.querySelector('.app__section-task-list');
 
//Pegando a descrição da nossa tarefa e adicionando no paragrafo
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

//Botão para remover as tarefas concluidas
const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas')
const btnRemoverTodas = document.querySelector('#btn-remover-todas')

// Nossas tarefas agora são pegadas do localStorage, com as informações das tarefas que recebemos
// Em resumo, ele vai pegar as informações no localStorage, depois vai passar para o JSON.parse para validar, caso não seja validado
// por não ter um valor ou algo do tipo, ele vai retornar um array vazio sem nenhum objeto
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || []
let tarefaSelecionada = null // pegando a tarefa selecionada
let liTarefaSelecionada = null // item de lista da tarefa selecionada

//Criando um seletor para o botão de cancelar das tarefas
const botaoCancelar = document.querySelector('.app__form-footer__button--cancel');

//funcao para atualizar todas as tarefas
function atualizarTarefas () {
  // Convertendo o array para uma string em formato JSON para poder armazenar.
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

//Funcao para cancelar a criação de uma nova tarefa
function cancelarTarefa() {
  textarea.value = '';
  formAdicionarTarefa.classList.add('hidden');
}

//Funcao para criar uma lista que vai criar um HTML com nossas tarefas
function criarElementoTarefa(tarefa) {
  const li = document.createElement('li'); // criando um elemento de 'li' = lista
  li.classList.add('app__section-task-list-item'); // adicionando uma classe no nosso li

  const svg = document.createElement('svg') // criando e utilizando um elemento 'SVG'
  svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
  `; // adicionando os elemento que vão dentro do SVG

  const paragrafo = document.createElement('p');
  paragrafo.textContent = tarefa.descricao // o texto do paragrafo vai ser a descricao da tarefa
  paragrafo.classList.add('app__section-task-list-item-description'); // adicionando uma classe no paragrafo

  const botao = document.createElement('button'); // criando o botao de editar
  botao.classList.add('app_button-edit'); // adicionando uma classe no botao

  botao.onclick = () => { // sempre que o usuario clicar no botão ele vai executar a função abaixo
    // debugger // serve para debugarmos o código caso aja algum problema, podemos executar linha por linha
    const novaDescricao = prompt('Qual é novo nome da tarefa?')
    if(novaDescricao) {
      paragrafo.textContent = novaDescricao // o paragrafo vai receber o nome prompt assim que clicado
      tarefa.descricao = novaDescricao // atualizando a descricao da tarefa no visualizador
      atualizarTarefas();// atualizando na localStorage também
    }
    
  }

  const imagemBotao = document.createElement('img'); // adciciona a imagem dentro do botao
  //buscando a imagem dentro do caminho 'SRC'
  imagemBotao.setAttribute('src', '/imagens/edit.png'); // valor do atributo que estamos definindo

  botao.append(imagemBotao); // adicionando a imagem dentro do botão

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  if(tarefa.completa) { //condicao para caso a tarefa esteja completa
    li.classList.add('app__section-task-list-item-complete') // Adicionando a classe de tarefa concluida
    botao.setAttribute('disabled', 'disabled') // Desabilitando o botão da tarefa finalizada
  } else {
    li.onclick = () => {

      document.querySelectorAll('.app__section-task-list-item-active')
      .forEach(elemento => {
        elemento.classList.remove('app__section-task-list-item-active')
      }) // aqui criamos uma condição que para cada elemento que conter a classe active, ele vai remover a classe
  
      if(tarefaSelecionada == tarefa) { // se a gente selecionou a tarefa que ja estava selecionada, a gente remove a seleção e não faz nada
        paragrafoDescricaoTarefa.textContent = ''
        tarefaSelecionada = null
        return
      }
  
      tarefaSelecionada = tarefa // a tarefa selecionada vai receber a tarefa que clicamos
      liTarefaSelecionada = li // aqui estamos passando o li que estamos criando
  
      paragrafoDescricaoTarefa.textContent = tarefa.descricao // pega a descrição da tarefa e adiciona no paragrafo
  
      li.classList.add('app__section-task-list-item-active'); // sempre que clicarmos no elemento ele vai ficar marcado com uma borda
    }
  }

  return li; // retorna nossa elemento preenchido
}

// Agora, adicionamos um ouvinte de eventos ao botão. Quando o botão for clicado, esta função será executada.
btnAdicionarTarefa.addEventListener('click', () => {
    // Esta linha vai alternar a visibilidade do nosso formulário. Lembra da classe 'hidden' que esconde elementos?
    formAdicionarTarefa.classList.toggle('hidden');
});

// Aqui, estamos ouvindo o evento de 'submit' do nosso formulário. 
// Esse evento ocorre quando tentamos enviar o formulário (geralmente, apertando o botão 'Enter' ou clicando em um botão de submit).
formAdicionarTarefa.addEventListener('submit', (evento) => {
    // Esta linha evita que a página recarregue (comportamento padrão de um formulário). Nós não queremos isso!
    evento.preventDefault();

    // Aqui, criamos um objeto tarefa com a descrição vinda da nossa textarea.
    const tarefa = {
        descricao: textarea.value
    };

    // Depois, adicionamos essa tarefa ao nosso array de tarefas.
    tarefas.push(tarefa);

    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa); // adicionando o elemento que criamos na 'ulTarefas', nossa lista

    // E, finalmente, armazenamos nossa function de lista de tarefas no localStorage. 
    atualizarTarefas();
    textarea.value = '' // apos criar uma nova tarefa, ele vai limpar a area de texto
    formAdicionarTarefa.classList.add('hidden'); //e assim que limpar o texto ele vai esconder o form até abrir novamente
});

//Selecionando o botão de cancelar e adicionando um evento de clique para quando o botão for clicado ele vai executar a funcao...
botaoCancelar.addEventListener('click', cancelarTarefa);


//Passando uma tarefa para a funcão que criamos, e para cada tarefa de tarefas, ele vai executar a funcão de criar um elemento de tarefa
tarefas.forEach(tarefa => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa); // aqui adicionamos nossa nova tarefa na nossa lista 'UL' de tarefas
});

document.addEventListener('FocoFinalizado', () => {
  if(tarefaSelecionada && liTarefaSelecionada) { // vendo se temos a tarefa selecionada
    liTarefaSelecionada.classList.remove('app__section-task-list-item-active') // removendo a classe active quando o estiver FocoFinali..
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete') // Adicionando a classe de tarefa concluida
    liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled') // Desabilitando o botão da tarefa finalizada
    tarefaSelecionada.completa = true
    atualizarTarefas();
  }
})

// Abaixo, nós criamos o clique para remover quando a tarefa estiver completa e também para limpar a tarefa do localStorage
const removerTarefas = (somenteCompletas) => {

  let seletor = ".app__section-task-list-item"

  if(somenteCompletas) {
    seletor = ".app__section-task-list-item-complete" 
  }

  document.querySelectorAll(seletor).forEach(elemento => {
    elemento.remove()
  })
  tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [] // se forem somente as complestas, 
  //delete somente as completas, caso contrario retorne uma array vazio, deletando tudo
  
  atualizarTarefas()
}


btnRemoverConcluidas.onclick = () => removerTarefas(true) // remove somente as concluidas que são 'true'
btnRemoverTodas.onclick = () => removerTarefas(false) // remove todas