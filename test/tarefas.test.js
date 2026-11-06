const { test } = require('node:test');
const assert = require('node:assert/strict');
const { TarefaModel } = require('../src/models/Tarefa');
const { criarApp } = require('../src/app');
const valido = { titulo: 'Estudar MVC', descricao: 'Revisar as camadas', disciplina: 'Programação' };

test('Model: limites, campos obrigatórios e atualização sem efeitos parciais', () => {
  const model = new TarefaModel();
  for (const dados of [
    { ...valido, titulo: '  ' }, { ...valido, titulo: 'a'.repeat(101) },
    { ...valido, disciplina: 'A' }, { ...valido, disciplina: 'a'.repeat(81) },
    { ...valido, descricao: 'a'.repeat(501) }, { ...valido, titulo: 123 }, {}
  ]) assert.throws(() => model.criar(dados), { name: 'Error' });
  assert.equal(model.listar().length, 0);
  const t = model.criar({ titulo: 'abc', disciplina: 'ab' });
  assert.equal(t.descricao, '');
  assert.equal(t.status, 'pendente');
  assert.throws(() => model.editar(t.id, { ...valido, disciplina: '' }));
  assert.equal(model.buscar(t.id).titulo, 'abc');
  const max = model.criar({ titulo: 'a'.repeat(100), disciplina: 'a'.repeat(80), descricao: 'a'.repeat(500) });
  assert.notEqual(t.id, max.id);
  const copia = model.buscar(t.id); copia.status = 'invalido';
  assert.equal(model.buscar(t.id).status, 'pendente');
});

test('HTTP: cadastrar, listar, consultar, editar, concluir, filtrar e confirmar exclusão', async t => {
  const app = criarApp();
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => app.close(resolve)));
  const base = `http://127.0.0.1:${app.address().port}`;
  const get = rota => fetch(base + rota, { redirect: 'manual' });
  const post = (rota, dados) => fetch(base + rota, { method: 'POST', body: new URLSearchParams(dados), redirect: 'manual' });
  assert.equal((await get('/tarefas')).status, 200);
  let r = await post('/tarefas', { ...valido, titulo: 'x' });
  assert.equal(r.status, 422); assert.match(await r.text(), /Revise os dados/);
  r = await post('/tarefas', { ...valido, status: 'concluida' });
  assert.equal(r.status, 303);
  let html = await (await get('/tarefas')).text();
  assert.match(html, /Pendente/);
  const id = html.match(/href="\/tarefas\/([0-9a-f-]{36})"/)[1];
  r = await get(`/tarefas/${id}`); html = await r.text();
  for (const valor of [valido.titulo, valido.disciplina, valido.descricao, id]) assert.ok(html.includes(valor));
  assert.equal((await post(`/tarefas/${id}/editar`, { ...valido, titulo: '  Trabalho revisado  ' })).status, 303);
  assert.match(await (await get(`/tarefas/${id}`)).text(), /Trabalho revisado/);
  assert.equal((await post(`/tarefas/${id}/concluir`, {})).status, 303);
  assert.match(await (await get('/tarefas?status=concluida')).text(), /Trabalho revisado/);
  assert.doesNotMatch(await (await get('/tarefas?status=pendente')).text(), /Trabalho revisado/);
  assert.equal((await get('/tarefas?status=outro')).status, 400);
  assert.equal((await get(`/tarefas/${id}/concluir`)).status, 405);
  // Abrir confirmação e cancelar (voltar) não remove o registro.
  assert.match(await (await get(`/tarefas/${id}/excluir`)).text(), /Sim, excluir tarefa/);
  assert.equal((await get(`/tarefas/${id}`)).status, 200);
  assert.equal((await post(`/tarefas/${id}/excluir`, {})).status, 400);
  assert.equal((await post(`/tarefas/${id}/excluir`, { confirmacao: 'sim' })).status, 303);
  assert.equal((await get(`/tarefas/${id}`)).status, 404);
  assert.equal((await get('/pagina-inexistente')).status, 404);
});

test('HTTP: texto cadastrado é escapado e status é preservado ao editar', async t => {
  const app = criarApp();
  await new Promise(resolve => app.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => app.close(resolve)));
  const base = `http://127.0.0.1:${app.address().port}`;
  const post = (rota, dados) => fetch(base + rota, { method: 'POST', body: new URLSearchParams(dados), redirect: 'manual' });
  await post('/tarefas', { ...valido, titulo: '<script>alert(1)</script>' });
  const html = await (await fetch(base + '/tarefas')).text();
  assert.ok(html.includes('&lt;script&gt;')); assert.ok(!html.includes('<script>'));
  const id = html.match(/href="\/tarefas\/([0-9a-f-]{36})"/)[1];
  await post(`/tarefas/${id}/concluir`, {});
  await post(`/tarefas/${id}/editar`, valido);
  assert.match(await (await fetch(base + `/tarefas/${id}`)).text(), /Concluída/);
});

test('Uma nova instância da aplicação inicia sem tarefas', () => {
  const primeira = new TarefaModel(); primeira.criar(valido);
  assert.deepEqual(new TarefaModel().listar(), []);
});
