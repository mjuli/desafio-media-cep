const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  const firstNumber = req.query.number1
  const secondNumber = req.query.number2

  let media
  console.warn(`firstNumber: ${firstNumber}`)
  console.warn(`secondNumber: ${secondNumber}`)

  if(!(isNaN(firstNumber) && isNaN(secondNumber))){
    media = (Number(firstNumber) + Number(secondNumber)) / 2
    media = (Math.round(media * 100) / 100).toFixed(2)
  }

  console.warn(`media: ${media}`)

  res.render('index.ejs', { media })
})

app.get('/buscarcep', (req, res) => {
  res.render('cep.ejs')
})

app.listen('8080', () => {
  console.warn('Servidor iniciado')
})