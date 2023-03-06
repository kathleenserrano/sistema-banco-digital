const { hashSync } = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const { contas } = require('../data/database')
const { verificarContaUsuario } = require('../utils/validacoes')

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    try {
        let id = uuidv4()

        const senhaCriptografada = hashSync(senha, 10)

        const conta = { nome, cpf, data_nascimento, telefone, email, senhaCriptografada }

        contas.push({ id, saldo: 0, conta })

        return res.status(201).json({ mensagem: 'Conta criada com sucesso!' })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const listarContas = (req, res) => {
    try {
        return res.status(200).json(contas);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const atualizarDadosUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { id } = req.params

    try {
        const contaUsuario = verificarContaUsuario(id)

        if (!contaUsuario) {
            return response.status(404).json({ mensagem: 'Conta bancária inválida' })
        }

        const senhaCriptografada = hashSync(senha, 10)

        const { usuario } = contaUsuario

        usuario.nome = nome
        usuario.cpf = cpf
        usuario.data_nascimento = data_nascimento
        usuario.telefone = telefone
        usuario.email = email
        usuario.senha = senhaCriptografada

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }

}

const excluirConta = (req, res) => {
    const { id } = req.params

    try {
        const contaUsuario = verificarContaUsuario(id)

        if (contaUsuario.saldo !== 0) {
            return res.status(400).json({ mensagem: 'Essa ação não poderá ser executada com saldo disponivel em conta' })
        }

        const contaIndex = contas.findIndex(conta => {
            return conta.numero === id
        })

        contas.splice(contaIndex, 1)

        return res.status(200).json()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }



}
module.exports = {
    cadastrarConta,
    listarContas,
    atualizarDadosUsuario,
    excluirConta
}