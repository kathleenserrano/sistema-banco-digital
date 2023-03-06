const express = require('express');
const contasController = require('./controllers/contasController');

const routes = express.Router();

routes.get('/contas', contasController.listarContas);
routes.post('/contas', contasController.cadastrarConta);
routes.put('/contas/:numeroConta/usuario', contasController.atualizarDadosUsuario);

module.exports = routes;