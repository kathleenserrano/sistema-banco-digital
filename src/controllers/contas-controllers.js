const { hashSync } = require('bcrypt')
const { v4: uuidv4 } = require('uuid')

const { escreverNoArquivo, lerArquivo } = require('../utils/manipulacaoDeArquivos')

const cadastrarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    try {
        let id = uuidv4()

        const senhaCriptografada = hashSync(senha, 10)

        const usuario = { nome, cpf, data_nascimento, telefone, email, senha: senhaCriptografada }

        const dadosUsuarioParse = lerArquivo()

        dadosUsuarioParse.contas.push({ id, saldo: 0, usuario })

        escreverNoArquivo(dadosUsuarioParse)

        return res.status(201).json({ mensagem: 'Conta criada com sucesso!' })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const listarContas = (req, res) => {
    try {
        const dadosUsuarioParse = lerArquivo()

        if (dadosUsuarioParse.contas.length === 0) {
            return res.status(404).json({ mensagem: 'Não temos usuários cadastrados' })
        }

        return res.status(200).json(dadosUsuarioParse.contas);
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const atualizarDadosUsuario = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body
    const { id } = req.params

    try {
        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
            return conta.id === id
        })

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Usuario não encontrado.' })
        }

        const senhaCriptografada = hashSync(senha, 10)

        const { usuario } = contaUsuario

        usuario.nome = nome
        usuario.cpf = cpf
        usuario.data_nascimento = data_nascimento
        usuario.telefone = telefone
        usuario.email = email
        usuario.senha = senhaCriptografada

        escreverNoArquivo(dadosUsuarioParse)

        return res.status(201).json(usuario)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }

}

const excluirConta = (req, res) => {
    const { id } = req.params

    try {
        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
            return conta.id === id
        })

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Usuario não encontrado.' })
        }

        if (contaUsuario.saldo !== 0) {
            return res.status(400).json({ mensagem: 'Essa ação não poderá ser executada com saldo disponivel em conta' })
        }

        const contaIndex = dadosUsuarioParse.contas.findIndex(conta => {
            return conta.id === id
        })

        dadosUsuarioParse.contas.splice(contaIndex, 1)

        escreverNoArquivo(dadosUsuarioParse)

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