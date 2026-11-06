# Roteiro de vídeo — aproximadamente 5 a 7 minutos

Use como apoio, adapte as falas ao seu jeito e explique o que você entendeu. Grave o navegador, o VS Code e sua narração. Teste o microfone antes. Não é necessário mostrar seu rosto.

## 1. Apresentação — 20 segundos

“Olá, meu nome é [seu nome]. Vou apresentar a Agenda Acadêmica, uma aplicação em Node.js para gerenciar tarefas de estudantes. Organizei o projeto em Model, View e Controller e utilizei um array de objetos para armazenar os dados em memória.”

## 2. Iniciar e cadastrar — 1 minuto

Mostre o terminal, execute `npm start` e abra `http://localhost:3000`.

Cadastre duas tarefas:

| Título | Disciplina | Descrição |
| --- | --- | --- |
| Estudar padrão MVC | Programação Web | Revisar Model, View e Controller. |
| Resolver lista de exercícios | Matemática | Resolver questões de revisão. |

“O identificador é gerado pela aplicação e toda tarefa começa como pendente. O título aceita de 3 a 100 caracteres, a disciplina de 2 a 80, e a descrição é opcional, limitada a 500.”

Tente cadastrar um título com dois caracteres para demonstrar a validação do navegador. Depois corrija e cancele ou conclua o cadastro. Explique que o servidor também valida os dados, mesmo que alguém contorne as restrições do navegador.

## 3. Demonstrar todas as operações — 1 a 2 minutos

1. Mostre a listagem e os status.
2. Abra Detalhes e mostre título, descrição, disciplina, ID e status.
3. Edite o título e a descrição da primeira tarefa. Salve e mostre o resultado.
4. Conclua a primeira tarefa e mostre a mudança do status.
5. Clique em Pendentes, Concluídas e Todas, mostrando os resultados de cada filtro.
6. Clique em Excluir na segunda tarefa e depois em Cancelar. Mostre que ela permanece.
7. Abra novamente Excluir e confirme a remoção.

“A edição mantém o identificador e o status. A exclusão exige confirmação. O filtro altera apenas o que é apresentado; os dados continuam no array.”

## 4. Explicar o código e o MVC — 2 minutos

Abra os arquivos no VS Code e mostre os métodos citados.

- `src/models/Tarefa.js`: mostre `#tarefas = []`, `validar`, `criar`, `listar`, `buscar`, `editar`, `concluir` e `excluir`.

“O Model concentra as regras e o acesso aos dados. A validação acontece antes de inserir ou alterar uma tarefa. O array é privado e os métodos de consulta retornam cópias, evitando alterações por fora das regras.”

- `src/views/tarefas.js`: mostre `listar`, `formulario`, `detalhes` e `confirmarExclusao`.

“As Views são responsáveis pela apresentação. Elas recebem os dados e geram HTML. A função escapeHtml trata o texto informado para impedir que ele seja interpretado como código HTML.”

- `src/controllers/TarefaController.js`: mostre `criar` e `tarefa`.

“O Controller recebe as ações encaminhadas pelas rotas, chama o Model e escolhe a View ou o redirecionamento. Se o Model rejeitar os dados, o formulário reaparece com as mensagens de erro.”

- `src/app.js` e `src/server.js`: mostre uma rota GET, uma POST e a inicialização.

“No cadastro, o navegador envia POST para /tarefas. A rota lê os campos, chama o Controller, que chama o Model. Depois ocorre um redirecionamento para a listagem. Na consulta, usamos GET, sem alterar os dados. Usei o módulo HTTP nativo do Node.js, sem dependências externas.”

## 5. Testes e memória — 40 segundos

Em outro terminal execute `npm test` e mostre o resultado. Não use somente a execução dos testes como demonstração: o navegador e o código precisam aparecer no vídeo.

Depois pare o servidor com Ctrl+C, inicie novamente e atualize a listagem para mostrar que ficou vazia.

“As tarefas ficam somente na memória do processo. Reiniciar o servidor apaga os dados, como solicitado na atividade. Os testes verificam as regras de validação e as operações do sistema.”

## 6. Encerramento — 10 segundos

“Essa separação mantém as regras no Model, a apresentação na View e a coordenação no Controller. O código-fonte está no repositório informado na entrega.”

## Antes de enviar

Confira se o vídeo tem áudio audível, mostra todas as funcionalidades, apresenta as três camadas e explica o fluxo de uma requisição. Abra os links do código e do vídeo para verificar se o professor terá acesso. Preencha ENTREGA.txt com os endereços reais.
