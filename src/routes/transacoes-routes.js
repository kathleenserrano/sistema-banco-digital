const { Router } = require("express")

const router = Router()

const controllers = require("../controllers/transacoes-controllers")
const { validarContaUsuario, validarSenha } = require("../middleware/validacoesTransacao")

router.post("/transacoes/depositar", validarContaUsuario, controllers.depositar)
router.post("/transacoes/sacar", validarContaUsuario, validarSenha, controllers.sacar)
router.post("/transacoes/transferir", validarContaUsuario, validarSenha, controllers.transferir)
router.get("/contas/saldo", controllers.saldo)
router.get("/contas/extrato", controllers.extrato)

module.exports = router;