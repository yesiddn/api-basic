const ditto = require('./pokemon/ditto.json')
const express = require('express')
const app = express()

app.disable('x-powered-by') // deshabilita el header X-Powered-By: Express por seguridad

const PORT = process.env.PORT ?? 3000

// si no se pone el next en el middleware, la petición se queda colgada
// middleware para todas las rutas
// app.use((req, res, next) => {
//   if (req.method !== 'POST') return next()
//   if (req.headers['content-type'] !== 'application/json') return next()

//   // solo se ejecuta si es un POST y el content-type es application/json
//   let body = ''

//   // evento data que se dispara cuando llegan datos
//   req.on('data', (chunk) => {
//     body += chunk.toString()
//     // console.log('chunk', chunk.toString())
//   })

//   req.on('end', () => {
//     const data = JSON.parse(body)

//     req.body = data
//     next()
//   })
// })

app.use(express.json()) // middleware para parsear el body de las peticiones con content-type: application/json

// middleware para una ruta específica
app.use('/pokemon', (req, res, next) => { next() })

// middleware para todas las rutas de /pokemon
app.use('/pokemon/*', (req, res, next) => { next() })

// middleware para una ruta específica y un método HTTP específico
app.get('/pokemon', (req, res, next) => { next() })

// routing
app.get('/', (req, res) => {
  // res.status(200).send('<h1>Home</h1>')
  // res.send('<h1>Home</h1>')
  res.json({ message: 'Home' })
})

app.get('/pokemon/ditto', (req, res) => {
  res.json(ditto)
})

app.post('/pokemon', (req, res) => {
  res.status(201).json(req.body)
})

// 404 Not Found in Express -> se pone al final de todas las rutas para que no interfiera con las demás
// con use se puede usar para cualquier método HTTP
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
