const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const PORT = 8080

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const firstNumber = req.query.number1
  const secondNumber = req.query.number2

  let media
  let err = []

  if(!isNaN(firstNumber) && !isNaN(secondNumber)){
    media = (Number(firstNumber) + Number(secondNumber)) / 2.0
    media = (Math.round(media * 100) / 100).toFixed(2)
  }

  if(isNaN(firstNumber) && firstNumber != undefined)
    err.push("Informe um número válido no PRIMEIRO campo!")

  if(isNaN(secondNumber) && secondNumber != undefined)
    err.push("Informe um número válido no SEGUNDO campo!")

  console.warn(`GET / - Calcular média:
    firstNumber: ${firstNumber}
    secondNumber: ${secondNumber}
    media: ${media}
    err: ${JSON.stringify(err)}`)

  res.render('index.ejs', { media, err })
})

app.get('/buscarcep', (req, res) => {
  res.render('cep.ejs')
})

app.listen(PORT, () => {
  console.warn('Servidor iniciado')
})