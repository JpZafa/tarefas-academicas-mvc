# Agenda Acadêmica — Node.js com MVC

Aplicação web para organizar tarefas acadêmicas, com cadastro, listagem, detalhes, edição, conclusão, exclusão com confirmação e filtros por status.

## Como executar

1. Instale o Node.js versão 22 ou superior.
2. Extraia o ZIP e abra a pasta `tarefas-mvc` no VS Code.
3. No terminal dessa pasta, execute:

```bash
npm start
```

4. Acesse **http://localhost:3000** no navegador.
5. Para encerrar, pressione **Ctrl+C** no terminal.

Não é necessário executar `npm install`: o projeto usa apenas módulos nativos do Node.js, sem dependências externas. Se a porta 3000 estiver ocupada, feche o outro servidor ou configure a variável de ambiente `PORT`.

**Importante:** as tarefas são armazenadas exclusivamente em um array de objetos no processo do servidor. Atualizar a página mantém os dados; reiniciar o servidor apaga todas as tarefas. Não há banco de dados, arquivo de persistência nem localStorage. Todos os acessos à mesma instância compartilham o array.

## Estrutura e responsabilidades

| Arquivo | Responsabilidade |
| --- | --- |
| `src/server.js` | Inicia o servidor na porta 3000. |
| `src/app.js` | Recebe requisições HTTP, identifica rotas e lê formulários. |
| `src/models/Tarefa.js` | Mantém o array, valida dados e realiza as operações. |
| `src/controllers/TarefaController.js` | Coordena as ações entre Model e View e envia respostas. |
| `src/views/tarefas.js` | Gera o HTML das telas e escapa textos cadastrados. |
| `public/style.css` | Define aparência e adaptação para telas menores. |
| `test/tarefas.test.js` | Testa regras do Model e o fluxo HTTP. |

O HTML é renderizado no servidor. As Views são funções JavaScript de apresentação. O roteamento usa `node:http`, e o padrão MVC não depende de um framework específico.

### Exemplo do fluxo de cadastro

O navegador envia `POST /tarefas`. O roteador lê o formulário e chama `controller.criar`. O Controller pede ao Model que valide e armazene a tarefa. Em caso de sucesso, redireciona para a listagem, cuja View gera o HTML. Se houver erro, responde com o formulário preenchido e as mensagens de validação, usando status HTTP 422.

## Regras dos dados

| Campo | Regra |
| --- | --- |
| `id` | UUID gerado por `crypto.randomUUID()`. |
| `titulo` | Obrigatório, entre 3 e 100 caracteres. |
| `descricao` | Opcional, até 500 caracteres; vazia quando omitida. |
| `disciplina` | Obrigatório, entre 2 e 80 caracteres. |
| `status` | `pendente` inicialmente; passa para `concluida` ao concluir. |

Espaços no início e fim são removidos antes de validar. O navegador ajuda com campos obrigatórios e limites; o servidor repete a validação no Model. Edição altera somente título, descrição e disciplina. O cliente não escolhe `id` nem `status`. Repetir uma conclusão mantém a tarefa concluída.

## Rotas

| Método | Rota | Ação |
| --- | --- | --- |
| GET | `/` | Redireciona à listagem. |
| GET | `/tarefas?status=todas` | Lista todas. |
| GET | `/tarefas?status=pendente` | Lista pendentes. |
| GET | `/tarefas?status=concluida` | Lista concluídas. |
| GET | `/tarefas/nova` | Abre cadastro. |
| POST | `/tarefas` | Cadastra. |
| GET | `/tarefas/:id` | Mostra todos os campos. |
| GET | `/tarefas/:id/editar` | Abre edição. |
| POST | `/tarefas/:id/editar` | Salva edição. |
| POST | `/tarefas/:id/concluir` | Conclui. |
| GET | `/tarefas/:id/excluir` | Exibe confirmação. |
| POST | `/tarefas/:id/excluir` | Exclui quando `confirmacao=sim`. |

O botão Cancelar na confirmação retorna aos detalhes e mantém a tarefa. Requisições GET não alteram dados. Após alterações, o redirecionamento HTTP 303 evita repetir o envio do formulário ao atualizar a página. Tarefas inexistentes retornam 404; filtros inválidos, 400.

## Testes

Na pasta do projeto:

```bash
npm test
```

Os testes verificam limites de caracteres, dados inválidos, atualização sem alteração parcial, geração de IDs, status inicial, isolamento do array, fluxo completo HTTP, filtros, confirmação de exclusão e escape de HTML.

## Publicar no GitHub

1. Entre na sua conta do GitHub e crie um repositório chamado `tarefas-academicas-mvc`.
2. Use **Add file → Upload files** para enviar o conteúdo da pasta `tarefas-mvc`, incluindo `src`, `public`, `test`, `package.json`, README e os demais arquivos.
3. Confirme o envio em **Commit changes**. Confira se `package.json` aparece na raiz do repositório e se as subpastas estão presentes.
4. Copie o endereço do repositório. O avaliador precisa ter acesso ao código.

Também é possível publicar pelo terminal, caso você já tenha o Git configurado:

```bash
git init
git add .
git commit -m "Implementa tarefas acadêmicas com MVC"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/tarefas-academicas-mvc.git
git push -u origin main
```

Substitua `SEU_USUARIO` pelo usuário da sua conta e crie antes o repositório remoto vazio.

## Vídeo e entrega

Leia `ROTEIRO-VIDEO.md`, teste a aplicação e grave sua tela com sua própria narração. Demonstre o funcionamento e o código. Não é necessário aparecer na câmera. Publique o vídeo em um serviço aceito pela sua instituição e verifique o acesso.

Preencha `ENTREGA.txt` com os dois links reais antes de enviar a atividade. O projeto não inclui um repositório publicado nem um vídeo gravado.

Este é um projeto didático local, sem autenticação ou separação de usuários.
