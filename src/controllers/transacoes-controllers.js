const { format } = require("date-fns");
const { compareSync } = require('bcrypt')
const { escreverNoArquivo, encontrarContaUsuario, lerArquivo } = require('../utils/manipulacaoDeArquivos')

const depositar = (req, res) => {
    const { id, valor } = req.body;

    try {
        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
            return conta.id === id
        })

        contaUsuario.saldo = contaUsuario.saldo + valor

        dadosUsuarioParse.depositos.push({ data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), id, valor })

        escreverNoArquivo(dadosUsuarioParse)

        return res.status(204).json({ mensagem: 'O deposito foi realizado com sucesso!' });
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const sacar = (req, res) => {
    const { id, valor } = req.body;

    try {
        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
            return conta.id === id
        })

        if (valor > contaUsuario.saldo) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente' })
        }

        contaUsuario.saldo = contaUsuario.saldo - valor

        dadosUsuarioParse.saques.push({ data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), id, valor })

        escreverNoArquivo(dadosUsuarioParse)

        return res.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const transferir = (req, res) => {
    const { id, id_destino, valor } = req.body

    if (!id_destino) {
        return res.status(400).json({ mensagem: 'O número da conta do destinatário é obrigatório' })
    }

    try {
        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
            return conta.id === id
        })

        const contaDestinatario = dadosUsuarioParse.contas.find(conta => {
            return conta.id === id_destino
        })

        if (!contaDestinatario) {
            return res.status(404).json({ mensagem: 'A conta informada para destinarário não foi encontrada' })
        }

        if (valor > contaUsuario.saldo) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente' })
        }

        contaUsuario.saldo = contaUsuario.saldo - valor

        contaDestinatario.saldo = contaDestinatario.saldo + valor

        dadosUsuarioParse.transferencias.push({ data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), id, id, valor })

        escreverNoArquivo(dadosUsuarioParse)

        return res.status(204).json({ mensagem: 'Transferência realizada com sucesso!' });
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const saldo = (req, res) => {
    const { id, senha } = req.query

    try {
        const contaUsuario = encontrarContaUsuario(id)

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Usuario não encontrado.' })
        }

        const validarSenha = compareSync(senha, contaUsuario.usuario.senha)

        if (!validarSenha) {
            return res.status(400).json({ mensagem: 'Senha inválida' })
        }

        return res.status(200).json({ saldo: contaUsuario.saldo })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const extrato = (req, res) => {
    const { id, senha } = req.query

    try {
        const dadosUsuarioParse = lerArquivo()

        const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
            return conta.id === id
        })

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Usuario não encontrado.' })
        }

        const validarSenha = compareSync(senha, contaUsuario.usuario.senha)

        if (!validarSenha) {
            return res.status(400).json({ mensagem: 'Senha inválida' })
        }

        let registrosDepositos = dadosUsuarioParse.depositos.filter((deposito) => {
            return deposito.id === id;
        });

        let registrosSaques = dadosUsuarioParse.saques.filter((saque) => {
            return saque.id === id;
        })

        let transferenciasEnviadasConta = [];

        let transferenciasRecebidasConta = [];

        dadosUsuarioParse.transferencias.forEach(transferencia => {
            if (transferencia.id === id) {
                transferenciasEnviadasConta.push(transferencia);
            } else if (transferencia.id_destino === id) {
                transferenciasRecebidasConta.push(transferencia);
            }
        })

        let extrato = { depositos: registrosDepositos, saques: registrosSaques, transferenciasEnviadasConta, transferenciasRecebidasConta }

        return res.status(201).json(extrato)
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

module.exports = {
    depositar,
    sacar,
    transferir,
    saldo,
    extrato
}
