const verificarContaUsuario = (id) => {
    const contaUsuario = contas.find(conta => {
        return conta.numero === id
    })

    return contaUsuario;
}

const verificarEmailCpf = (email, cpf) => {
    const contaUsuario = contas.find(conta => {
        return conta.usuario.email === email || conta.usuario.cpf === cpf
    })

    return contaUsuario;
}

module.exports = {
    verificarContaUsuario,
    verificarEmailCpf
}