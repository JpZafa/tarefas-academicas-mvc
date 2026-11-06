// As Views geram HTML. escapeHtml impede que texto cadastrado execute HTML/scripts.
const escapeHtml = valor => String(valor ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const statusTexto = tarefa => tarefa.status === 'concluida' ? 'Concluída' : 'Pendente';
function layout(titulo, conteudo) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(titulo)} | Agenda Acadêmica</title><link rel="stylesheet" href="/style.css"></head>
  <body><header><div class="marca">AA <span>Agenda Acadêmica</span></div><p>Organize seus estudos, uma tarefa de cada vez.</p></header>
  <main>${conteudo}</main><footer>Projeto Node.js · MVC · Dados em memória: reiniciar o servidor apaga as tarefas.</footer></body></html>`;
}
function listar(tarefas, filtro, contagem, aviso = '') {
  return layout('Minhas tarefas', `<div class="cabecalho"><div><p class="sobretitulo">SEU PLANEJAMENTO</p><h1>Minhas tarefas</h1></div><a class="botao" href="/tarefas/nova">+ Nova tarefa</a></div>
  ${aviso ? `<p class="aviso" role="status">${escapeHtml(aviso)}</p>` : ''}
  <section class="resumo" aria-label="Resumo"><div><strong>${contagem.total}</strong> tarefas</div><div><strong>${contagem.pendente}</strong> pendentes</div><div><strong>${contagem.concluida}</strong> concluídas</div></section>
  <nav class="filtros" aria-label="Filtrar tarefas">${[['todas','Todas'],['pendente','Pendentes'],['concluida','Concluídas']].map(([valor, texto]) => `<a ${filtro === valor ? 'aria-current="page" class="ativo"' : ''} href="/tarefas?status=${valor}">${texto}</a>`).join('')}</nav>
  <section class="tarefas" aria-label="Tarefas">${tarefas.length ? tarefas.map(t => `<article class="cartao"><div class="cabecalho"><span class="disciplina">${escapeHtml(t.disciplina)}</span><span class="status ${t.status}">${statusTexto(t)}</span></div>
  <h2><a href="/tarefas/${t.id}">${escapeHtml(t.titulo)}</a></h2><p class="descricao">${escapeHtml(t.descricao || 'Sem descrição.')}</p><div class="acoes"><a href="/tarefas/${t.id}">Detalhes</a><a href="/tarefas/${t.id}/editar">Editar</a>
  ${t.status === 'pendente' ? `<form method="post" action="/tarefas/${t.id}/concluir"><button class="link" type="submit">Concluir</button></form>` : ''}
  <a class="perigo" href="/tarefas/${t.id}/excluir">Excluir</a></div></article>`).join('') : '<div class="vazio"><h2>Nenhuma tarefa por aqui</h2><p>Cadastre uma tarefa ou escolha outro filtro.</p></div>'}</section>`);
}
function formulario(tarefa = {}, erros = [], editando = false) {
  const titulo = editando ? 'Editar tarefa' : 'Nova tarefa';
  return layout(titulo, `<a href="/tarefas">← Voltar às tarefas</a><h1>${titulo}</h1>
  ${erros.length ? `<div class="erros" role="alert"><strong>Revise os dados:</strong><ul>${erros.map(e => `<li>${escapeHtml(e)}</li>`).join('')}</ul></div>` : ''}
  <form class="painel formulario" method="post" action="${editando ? `/tarefas/${tarefa.id}/editar` : '/tarefas'}">
  <label for="titulo">Título *</label><input id="titulo" name="titulo" required minlength="3" maxlength="100" value="${escapeHtml(tarefa.titulo)}"><small>De 3 a 100 caracteres.</small>
  <label for="disciplina">Disciplina *</label><input id="disciplina" name="disciplina" required minlength="2" maxlength="80" value="${escapeHtml(tarefa.disciplina)}"><small>De 2 a 80 caracteres.</small>
  <label for="descricao">Descrição</label><textarea id="descricao" name="descricao" maxlength="500" rows="5">${escapeHtml(tarefa.descricao)}</textarea><small>Opcional, até 500 caracteres.</small>
  <div class="acoes"><button class="botao" type="submit">${editando ? 'Salvar alterações' : 'Cadastrar tarefa'}</button><a href="/tarefas">Cancelar</a></div></form>`);
}
function detalhes(t) {
  return layout(t.titulo, `<a href="/tarefas">← Voltar às tarefas</a><section class="painel"><span class="status ${t.status}">${statusTexto(t)}</span><h1>${escapeHtml(t.titulo)}</h1><dl><dt>Disciplina</dt><dd>${escapeHtml(t.disciplina)}</dd><dt>Descrição</dt><dd class="texto">${escapeHtml(t.descricao || 'Sem descrição.')}</dd><dt>Identificador</dt><dd class="identificador">${t.id}</dd><dt>Status no sistema</dt><dd>${t.status}</dd></dl><div class="acoes"><a class="botao" href="/tarefas/${t.id}/editar">Editar tarefa</a>${t.status === 'pendente' ? `<form method="post" action="/tarefas/${t.id}/concluir"><button class="botao" type="submit">Concluir tarefa</button></form>` : ''}<a class="perigo" href="/tarefas/${t.id}/excluir">Excluir</a></div></section>`);
}
function confirmarExclusao(t) {
  return layout('Excluir tarefa', `<section class="painel"><h1>Excluir tarefa?</h1><p>Confirma a exclusão de <strong>${escapeHtml(t.titulo)}</strong>?</p><p>Essa ação não pode ser desfeita.</p><form method="post" action="/tarefas/${t.id}/excluir"><input type="hidden" name="confirmacao" value="sim"><div class="acoes"><button class="botao excluir" type="submit">Sim, excluir tarefa</button><a href="/tarefas/${t.id}">Cancelar</a></div></form></section>`);
}
function erro(codigo, mensagem) { return layout('Aviso', `<section class="painel"><h1>${codigo}</h1><p>${escapeHtml(mensagem)}</p><a href="/tarefas">Voltar às tarefas</a></section>`); }
module.exports = { listar, formulario, detalhes, confirmarExclusao, erro };
