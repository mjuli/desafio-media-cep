const express = require('express')
const app = require('./server')

const PORT = 8080

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.listen(PORT, () => {
  console.warn('Servidor iniciado')
})