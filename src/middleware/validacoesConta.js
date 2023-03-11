const { lerArquivo } = require("../utils/manipulacaoDeArquivos")

const validacoesDadosUsuario = (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body

    try {
        if (!nome) {
            return res.status(400).json({ mensagem: 'Preencha o campo nome' })
        }

        if (!cpf) {
            return res.status(400).json({ mensagem: 'Preencha o campo cpf' })
        }

        if (!data_nascimento) {
            return res.status(400).json({ mensagem: 'Preencha o campo data de nascimento' })
        }

        if (!telefone) {
            return res.status(400).json({ mensagem: 'Preencha o campo telefone' })
        }

        if (!email) {
            return res.status(400).json({ mensagem: 'Preencha o campo email' })
        }

        if (!senha) {
            return res.status(400).json({ mensagem: 'Preencha o campo senha' })
        }

        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find(conta => {
            return conta.usuario.email === email || conta.usuario.cpf === cpf
        })

        if (contaUsuario) {
            return res.status(400).json({ mensagem: 'O cpf ou email informado já existe cadastrado.' })
        }

        next()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = {
    validacoesDadosUsuario
}