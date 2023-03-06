const express = require("express")

const routerContas = require("./routes/contas-routes")
const routerTrasacoes = require("./routes/transacoes-routes")

const app = express()

app.use(express.json())

app.use(routerContas)
app.use(routerTrasacoes)

module.exports = app