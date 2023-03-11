const fs = require('fs')

const lerArquivo = () => {
    let dadosUsuario = fs.readFileSync('src/data/database.json')

    let dadosUsuarioParse = JSON.parse(dadosUsuario)

    return dadosUsuarioParse
}

const encontrarContaUsuario = (id) => {
    const dadosUsuarioParse = lerArquivo()

    const contaUsuario = dadosUsuarioParse.contas.find((conta) => {
        return conta.id === id
    })

    return contaUsuario
}

const escreverNoArquivo = (parse) => {
    let dadosUsuarioStringify = JSON.stringify(parse)

    fs.writeFileSync('src/data/database.json', dadosUsuarioStringify)
}

module.exports = {
    lerArquivo,
    encontrarContaUsuario,
    escreverNoArquivo
}