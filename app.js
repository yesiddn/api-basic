// REST es Representational State Transfer -> arquiterura de software que define un conjunto de restricciones a ser usadas para la creación de servicios web -> se creo en el 2000 por Roy Fielding

// Sus principios son: escabilidad, simplicidad, portabilidad, visibilidad, fiabilidad y modificabilidad

const express = require('express') // npm install express -E para que se instale la versión exacta que se tiene en package.json
const crypto = require('node:crypto') // node:crypto es un módulo nativo de node.js para encriptar datos
const movies = require('./movies.json')
const { validateMovie } = require('./schemas/movies')

const app = express()
app.use(express.json())
app.disable('x-powered-by')

const PORT = process.env.PORT ?? 3000

// todas las peliculas y tambien por genero
app.get('/movies', (req, res) => {
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
    id: crypto.randomUUID(), // genera un id aleatorio con la libreria crypto
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
  movies.push(newMovie)

  res.status(201).json(newMovie)
})

app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`)
})
