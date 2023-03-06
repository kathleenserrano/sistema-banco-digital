const { banco } = require('../ data / database')

const autenticacaoBanco = async (req, res, next) => {
    const { senha_banco } = req.query

    try {

        if (!senha_banco) {
            return response.status(401).json({ mensagem: 'A senha é obrigatória' })
        }

        if (senha_banco !== banco.senha) {
            return response.status(403).json({ mensagem: 'Senha inválida' })
        }

        next()
    } catch (error) {
        return res.status(401).json({ mensagem: 'Para acessar este recurso é necessário informar a senha' })
    }
}

module.exports = { autenticacaoBanco }