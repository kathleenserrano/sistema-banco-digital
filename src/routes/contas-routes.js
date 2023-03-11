const { Router } = require('express')

const router = Router();

const { autenticacaoBanco } = require("../middleware/autenticacaoBanco");
const { validacoesDadosUsuario } = require("../middleware/validacoesConta")
const controllers = require("../controllers/contas-controllers");

router.get("/contas", autenticacaoBanco, controllers.listarContas)
router.post("/contas", validacoesDadosUsuario, controllers.cadastrarConta)
router.put("/contas/:id/usuario", validacoesDadosUsuario, controllers.atualizarDadosUsuario)
router.delete("/contas/:id", controllers.excluirConta)

module.exports = router;