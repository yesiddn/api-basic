// REST es Representational State Transfer -> arquiterura de software que define un conjunto de restricciones a ser usadas para la creación de servicios web -> se creo en el 2000 por Roy Fielding

// Sus principios son: escabilidad, simplicidad, portabilidad, visibilidad, fiabilidad y modificabilidad

import express, { json } from 'express' // npm install express -E para que se instale la versión exacta que se tiene en package.json
import { randomUUID } from 'node:crypto' // node:crypto es un módulo nativo de node.js para encriptar datos
import cors from 'cors' // npm install cors -E
// import movies from './movies.json' // error porque no es valido con ecma script modules
// import movies from './movies.json' asserts { type: 'json' } // hay que especificar que tipo de archivo es -> ESTA sintaxis cambió y ya no es valida
// import movies from './movies.json' with { type: 'json' } // esta sintaxis es la "nueva" pero aun no es soportada por node.js (import del futuro)
import { validateMovie, validatePartialMovie } from './schemas/movies.js'
import { readJSON } from './utils/readJson.js'

// hay dos formas de importar un archivo json:
// 1. Usando la libreria fs (file system) de node.js
// import fs from 'node:fs'

// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

// 2. Creando un require (forma recomendada en ESModules por ahora) -> enviado a otro modulo /utils
const movies = readJSON('./movies.json') // para JSON gigantes esta es la mejor forma de importarlos

const app = express()
app.use(json())
// app.use(cors()) // WARNING -> este middleware pone un * a todos los endpoints -> no es recomendable usarlo asi
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      'http://localhost:8080',
      'http://localhost:1234',
      'https://movies.com'
    ]

    if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  }
})) // se puede pasar un objeto con las opciones que se quieran
app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

// const ACCEPTED_ORIGINS = ['http://localhost:1234', 'http://localhost:8080', 'https://movies.com']

// Idempotencia -> Propiedad de realizar una acción determinada varias veces y aún así conseguir el mismo resultado que se obtendría si se realizara una sola vez

// metodos normales: GET, HEAD, POST
// metodos complejos: PUT, PATCH, DELETE -> requieren una peticion especial OPTIONS para saber si se puede hacer la peticion o no

// CORS PRE-FLIGHT (esta en todos los metodos complejos)

// todas las peliculas y tambien por genero
app.get('/movies', (req, res) => {
  // const origin = req.headers.origin // el origen de la peticion -> NO se envia el origin cuando se hace la peticion desde el mismo origen

  // res.header('Access-Control-Allow-Origin', 'http://localhost:8080') // solo el origen que se le indique esta permitido (en este caso localhost:8080
  // res.header('Access-Control-Allow-Origin', '*') // solucion de CORS para un solo endpoint -> todos los origenes que no sean nuestro propio origen estan permitidos

  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }

  const { genre } = req.query // un query string es una cadena de texto que se envía en la url para filtrar datos

  if (genre) {
    const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))

    return res.json(filteredMovies)
  }

  res.json(movies)
})

// peliculas por id
app.get('/movies/:id', (req, res) => { // :id es un parámetro de la ruta -> de la biblioteca path-to-regexp -> segmento dinámico
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)

  res.status(404).json({ message: 'Movie not found' })
})

app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  // para validacion de datos, zod.dev -> npm install zod -E

  if (result.error) {
    // tambien se puede usar 422 Unprocessable Entity
    return res.status(400).json({ errors: JSON.parse(result.error.message) })
  }

  const newMovie = {
    id: randomUUID(), // genera un id aleatorio con la libreria crypto
    // ...req.body // es mala practica porque se puede enviar cualquier cosa en el body si no se tiene un schema
    ...result.data
    // title,
    // genre,
    // director,
    // year,
    // duration,
    // rate: rate ?? 0, // si no se envia el rate, se le asigna 0
    // poster
  }
  movies.atpush(newMovie)

  res.status(201).json(newMovie)
}) // no es idempotente porque cada vez que se hace un post se crea un nuevo recurso

app.patch('/movies/:id', (req, res) => {
  const result = validatePartialMovie(req.body)

  if (!result.success) {
    return res.status(404).json({ errors: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  return res.json(updatedMovie)
}) // Normalmente sí lo podría ser, pero depende, por ejemplo si se tiene un campo updatedAt, entonces no sería idempotente (pasaria lo mismo con PUT pero PUT no se usa para actualizar parcialmente, sino para actualizar todo el recurso)

// PUT -> Si es idempotente porque el resultado es el mismo si se hace una o varias veces

app.delete('/movies/:id', (req, res) => {
  // const origin = req.headers.origin
  // if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
  // res.header('Access-Control-Allow-Origin', origin)
  // } // seguira dando error de CORS porque el metodo options no esta implementado

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) return res.status(404).json({ message: 'Movie not found' })

  movies.splice(movieIndex, 1)

  return res.status(204).json({ message: 'Movie deleted' })
})

// app.options('/movies:id', (req, res) => {
//   const origin = req.headers.origin
//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header('Access-Control-Allow-Origin', origin)
//   }

//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
//   // res.header('Access-Control-Allow-Headers', 'Content-Type')

//   res.status(200).send()
// })

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
