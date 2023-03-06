const { format } = require("date-fns");
const { compareSync } = require('bcrypt')
const { verificarContaUsuario } = require('../utils/validacoes')
const { contas, depositos, saques, transferencias } = require("../bancodedados");

const depositar = (req, res) => {
    const { id, valor } = request.body;

    if (!id || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor a ser depositado são obrigatórios' })
    }

    try {
        const contaUsuario = verificarContaUsuario(id)

        contaUsuario.saldo = contaUsuario.saldo + valor

        depositos.push({ data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), numero_conta: id, valor })

        return response.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const sacar = (req, res) => {
    const { id, valor, senha } = req;

    if (!id || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta e o valor a ser depositado são obrigatórios' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' })
    }

    try {
        const contaUsuario = verificarContaUsuario(id)

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' })
        }

        const validarSenha = compareSync(senha, contaUsuario.usuario.senha)

        if (!validarSenha) {
            return res.status(400).json({ mensagem: 'Senha inválida' })
        }

        if (valor > contaUsuario.saldo) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente' })
        }

        contaUsuario.saldo = contaUsuario.saldo - valor

        saques.push({ data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), numero_conta: id, valor })

        return response.status(204).json()
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const transferir = (req, res) => {
    const { id, id_destino, valor, senha } = req.body

    if (!id || !valor) {
        return res.status(400).json({ mensagem: 'O número da conta de origgem e o valor a ser transferido são obrigatórios' })
    }

    if (!id_destino) {
        return res.status(400).json({ mensagem: 'O número da conta do destinatário é obrigatório' })
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'A senha é obrigatória' })
    }

    try {
        const contaUsuario = verificarContaUsuario(id)

        const contaDestinatario = contas.find(conta => {
            return conta.numero === id_destino
        })

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' })
        }

        if (!contaDestinatario) {
            return res.status(404).json({ mensagem: 'A conta informada para destinarário não foi encontrada' })
        }

        if (valor > contaUsuario.saldo) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente' })
        }

        const validarSenha = compareSync(senha, contaUsuario.usuario.senha)

        if (!validarSenha) {
            return res.status(400).json({ mensagem: 'Senha inválida' })
        }

        contaUsuario.saldo = contaUsuario.saldo - valor

        contaDestinatario.usuario = contaDestinatario.saldo + valor

        transferencias.push({ data: format(new Date(), "yyyy-MM-dd HH:mm:ss"), id, id_destino, valor })

        return res.status(204).json();
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }
}

const saldo = (req, res) => {
    const { id } = req.query

    try {
        const contaUsuario = verificarContaUsuario(id)

        if (!contaUsuario) {
            return res.status(404).json({ mensagem: 'Conta não encontrada' })
        }

        return res.status(200).json({ saldo: contaUsuario.saldo })
    } catch (error) {
        return res.status(500).json({ mensagem: `Erro do servidor ${error.message}` })
    }


}

const extrato = (req, res) => {
    const { id } = req.query

    try {
        let registrosDepositos = depositos.filter((deposito) => {
            return deposito.numero_conta === id;
        });

        let registrosSaques = saques.filter((saque) => {
            return saque.numero_conta === id;
        })

        let transferenciasEnviadasConta = [];

        let transferenciasRecebidasConta = [];

        transferencias.forEach(transferencia => {
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
