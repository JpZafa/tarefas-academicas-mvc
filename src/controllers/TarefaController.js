const views = require('../views/tarefas');
const { ErroValidacao } = require('../models/Tarefa');

class TarefaController {
  constructor(model) { this.model = model; }
  html(res, conteudo, status = 200) {
    res.writeHead(status, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(conteudo);
  }
  redirecionar(res, destino) { res.writeHead(303, { Location: destino }); res.end(); }
  listar(res, url) {
    const filtro = url.searchParams.get('status') || 'todas';
    if (!['todas', 'pendente', 'concluida'].includes(filtro)) return this.html(res, views.erro(400, 'Filtro inválido.'), 400);
    const todas = this.model.listar();
    const avisos = { criada: 'Tarefa cadastrada.', editada: 'Tarefa atualizada.', concluida: 'Tarefa concluída.', excluida: 'Tarefa excluída.' };
    this.html(res, views.listar(this.model.listar(filtro), filtro, {
      total: todas.length, pendente: todas.filter(t => t.status === 'pendente').length,
      concluida: todas.filter(t => t.status === 'concluida').length
    }, avisos[url.searchParams.get('aviso')]));
  }
  nova(res) { this.html(res, views.formulario()); }
  criar(res, dados) {
    try { this.model.criar(dados); this.redirecionar(res, '/tarefas?aviso=criada'); }
    catch (e) { if (!(e instanceof ErroValidacao)) throw e; this.html(res, views.formulario(dados, e.erros), 422); }
  }
  tarefa(res, id, acao, dados, metodo) {
    const tarefa = this.model.buscar(id);
    if (!tarefa) return this.html(res, views.erro(404, 'Tarefa não encontrada.'), 404);
    if (metodo === 'GET') {
      const conteudo = acao === 'editar' ? views.formulario(tarefa, [], true)
        : acao === 'excluir' ? views.confirmarExclusao(tarefa) : views.detalhes(tarefa);
      return this.html(res, conteudo);
    }
    if (acao === 'editar') {
      try { this.model.editar(id, dados); }
      catch (e) { if (!(e instanceof ErroValidacao)) throw e; return this.html(res, views.formulario({ ...dados, id }, e.erros, true), 422); }
    } else if (acao === 'concluir') this.model.concluir(id);
    else if (acao === 'excluir') {
      if (dados.confirmacao !== 'sim') return this.html(res, views.erro(400, 'Confirme a exclusão antes de remover a tarefa.'), 400);
      this.model.excluir(id);
    }
    this.redirecionar(res, `/tarefas?aviso=${{ editar: 'editada', concluir: 'concluida', excluir: 'excluida' }[acao]}`);
  }
}
module.exports = TarefaController;
