const ditto = require('./pokemon/ditto.json')
const express = require('express')
const app = express()

app.disable('x-powered-by') // deshabilita el header X-Powered-By: Express por seguridad

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  // res.status(200).send('<h1>Home</h1>')
  // res.send('<h1>Home</h1>')
  res.json({ message: 'Home' })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  let body = ''

  // evento data que se dispara cuando llegan datos
  req.on('data', (chunk) => {
    body += chunk.toString()
    // console.log('chunk', chunk.toString())
  })

  req.on('end', () => {
    const data = JSON.parse(body)

    res.status(201).json(data)
  })
})

// 404 Not Found in Express -> se pone al final de todas las rutas para que no interfiera con las demás
// con use se puede usar para cualquier método HTTP
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
