const { randomUUID } = require('node:crypto');

class ErroValidacao extends Error {
  constructor(erros) { super('Dados inválidos'); this.erros = erros; }
}

// O array pertence ao Model. Nenhum arquivo é usado para persistir tarefas.
class TarefaModel {
  #tarefas = [];

  validar(dados) {
    const tarefa = {};
    const erros = [];
    for (const [campo, minimo, maximo, nome] of [
      ['titulo', 3, 100, 'Título'],
      ['descricao', 0, 500, 'Descrição'],
      ['disciplina', 2, 80, 'Disciplina']
    ]) {
      const valor = dados[campo] ?? '';
      if (typeof valor !== 'string') { erros.push(`${nome} deve ser um texto.`); continue; }
      tarefa[campo] = valor.trim();
      const tamanho = Array.from(tarefa[campo]).length;
      if (tamanho < minimo || tamanho > maximo) {
        erros.push(`${nome}: informe ${minimo ? `entre ${minimo} e` : 'até'} ${maximo} caracteres.`);
      }
    }
    if (erros.length) throw new ErroValidacao(erros);
    return tarefa;
  }

  listar(status = 'todas') {
    return this.#tarefas.filter(t => status === 'todas' || t.status === status).map(t => ({ ...t }));
  }
  buscar(id) { const t = this.#tarefas.find(t => t.id === id); return t ? { ...t } : null; }
  criar(dados) {
    const tarefa = { id: randomUUID(), ...this.validar(dados), status: 'pendente' };
    this.#tarefas.push(tarefa);
    return { ...tarefa };
  }
  editar(id, dados) {
    const tarefa = this.#tarefas.find(t => t.id === id);
    if (!tarefa) return null;
    // Validar tudo antes de modificar evita uma atualização parcial.
    Object.assign(tarefa, this.validar(dados));
    return { ...tarefa };
  }
  concluir(id) {
    const tarefa = this.#tarefas.find(t => t.id === id);
    if (!tarefa) return null;
    tarefa.status = 'concluida';
    return { ...tarefa };
  }
  excluir(id) {
    const indice = this.#tarefas.findIndex(t => t.id === id);
    if (indice < 0) return false;
    this.#tarefas.splice(indice, 1);
    return true;
  }
}
module.exports = { TarefaModel, ErroValidacao };
