const { Router } = require("express")

const router = Router()

const controllers = require("../controllers/transacoes-controllers")

router.post("/transacoes/depositar", controllers.depositar)
router.post("/transacoes/sacar", controllers.sacar)
router.post("/transacoes/transferir", controllers.transferir)
router.get("/contas/saldo", controllers.saldo)
router.get("/contas/extrato", controllers.extrato)

module.exports = router;