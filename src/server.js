const { criarApp } = require('./app');
const porta = Number(process.env.PORT || 3000);
const app = criarApp();
app.on('error', erro => { console.error(`Não foi possível iniciar: ${erro.message}`); process.exitCode = 1; });
app.listen(porta, '127.0.0.1', () => console.log(`Agenda Acadêmica: http://localhost:${porta}`));
