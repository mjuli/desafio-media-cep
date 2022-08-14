const express = require('express')
const app = express()
const axios = require('axios')

const PORT = 8080

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => {
  const firstNumber = req.query.number1
  const secondNumber = req.query.number2

  let media
  let err = []

  try {
    if(!isNaN(firstNumber) && !isNaN(secondNumber)){
      media = (Number(firstNumber) + Number(secondNumber)) / 2.0
      media = (Math.round(media * 100) / 100).toFixed(2)
    }

    if(firstNumber || secondNumber){
      if(isNaN(firstNumber))
        err.push("Informe um número válido no PRIMEIRO campo!")

      if(isNaN(secondNumber))
        err.push("Informe um número válido no SEGUNDO campo!")
    }

    console.warn(`GET / - Calcular média:
      firstNumber: ${firstNumber}
      secondNumber: ${secondNumber}
      media: ${media}
      err: ${JSON.stringify(err)}`)

    res.render('index.ejs', { media, err })
  } catch (error) {
    console.error('GET / - error:', error)
  }
})

app.get('/buscarcep', async(req, res) => {
  let warn, endereco

  let cep = req.query.cep

  try {
    if(cep){
      cep = cep.replace(/-/, '')

      const validacep = /^[0-9]{8}$/

      if(validacep.test(cep)){
        const url = `https://viacep.com.br/ws/${cep}/json`
        const response = await axios(url)

        if(response.data)
          endereco = response.data

        if(endereco.bairro == '')
          warn = "Não foi possível encontrar o Bairro deste CEP"
      }
    }

    if(cep && (!endereco || endereco.erro))
      warn = "CEP inválido"

    console.warn(`GET /buscarcep - Buscar CEP:
      cep: ${cep},
      endereco: ${JSON.stringify(endereco)},
      warn: ${warn}`)

    res.render('cep.ejs', { endereco, warn })

  } catch (error) {
    if (error.response) {
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error('Error', error.message);
    }
    console.error(error.config);
  }
})

app.listen(PORT, () => {
  console.warn('Servidor iniciado')
})