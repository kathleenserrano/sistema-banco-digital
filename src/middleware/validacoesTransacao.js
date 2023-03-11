const { compareSync } = require('bcrypt')
const { encontrarContaUsuario } = require('../utils/manipulacaoDeArquivos')

const validarContaUsuario = (req, res, next) => {
    const { id, valor } = req.body

    if (!id || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta (id) e o valor a ser depositado são obrigatórios' })
    }

    const contaUsuario = encontrarContaUsuario(id)

    if (!contaUsuario) {
        return res.status(404).json({ mensagem: 'Usuario não encontrado.' })
    }

    next()
}

const validarSenha = (req, res, next) => {
    const { id, senha } = req.body

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' })
    }

    const contaUsuario = encontrarContaUsuario(id)

    const validarSenha = compareSync(senha, contaUsuario.usuario.senha)

    if (!validarSenha) {
        return res.status(400).json({ mensagem: 'Senha inválida' })
    }

    next()
}

module.exports = {
    validarContaUsuario,
    validarSenha
}