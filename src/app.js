const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { TarefaModel } = require('./models/Tarefa');
const TarefaController = require('./controllers/TarefaController');
const views = require('./views/tarefas');

async function lerFormulario(req) {
  if (!(req.headers['content-type'] || '').startsWith('application/x-www-form-urlencoded')) {
    throw Object.assign(new Error('Formato de formulário não suportado.'), { status: 415 });
  }
  const partes = [];
  let tamanho = 0;
  for await (const parte of req) {
    tamanho += parte.length;
    if (tamanho > 16384) throw Object.assign(new Error('Formulário muito grande.'), { status: 413 });
    partes.push(parte);
  }
  return Object.fromEntries(new URLSearchParams(Buffer.concat(partes).toString('utf8')));
}
// Cada aplicação possui seu próprio Model e array, facilitando testes isolados.
function criarApp() {
  const controller = new TarefaController(new TarefaModel());
  const css = fs.readFileSync(path.join(__dirname, '../public/style.css'));
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'self'; style-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
    try {
      const url = new URL(req.url, 'http://localhost');
      const rota = url.pathname;
      if (req.method === 'GET' && rota === '/style.css') {
        res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' }); return res.end(css);
      }
      if (req.method === 'GET' && rota === '/') return controller.redirecionar(res, '/tarefas');
      if (req.method === 'GET' && rota === '/tarefas') return controller.listar(res, url);
      if (req.method === 'GET' && rota === '/tarefas/nova') return controller.nova(res);
      if (req.method === 'POST' && rota === '/tarefas') return controller.criar(res, await lerFormulario(req));
      const resultado = rota.match(/^\/tarefas\/([0-9a-f-]{36})(?:\/(editar|concluir|excluir))?$/);
      if (resultado) {
        const [, id, acao] = resultado;
        const permitido = req.method === 'GET' ? acao !== 'concluir' : req.method === 'POST' && !!acao;
        if (!permitido) return controller.html(res, views.erro(405, 'Método não permitido.'), 405);
        return controller.tarefa(res, id, acao, req.method === 'POST' ? await lerFormulario(req) : {}, req.method);
      }
      controller.html(res, views.erro(404, 'Página não encontrada.'), 404);
    } catch (e) {
      if (!e.status) console.error(e);
      controller.html(res, views.erro(e.status || 500, e.status ? e.message : 'Erro interno do servidor.'), e.status || 500);
    }
  });
}
module.exports = { criarApp };
