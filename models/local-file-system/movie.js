import { randomUUID } from 'node:crypto'
import { readJSON } from '../../utils/readJson.js'

const movies = readJSON('../movies.json')

export class MovieModel {
  // con un método asíncrono nos aseguramos de que siempre devolvemos una promesa así no tengamos codigo asíncrono, pero nos permite que en el futuro podamos usar código asíncrono (contrato con todos los métodos)
  static getAll = async ({ genre }) => {
    // de esta forma en el routing no se preocupan de la forma en la que se obtienen los datos
    if (genre) {
      return movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()))
    }

    return movies
  }

  // no es obligatorio tener un método con arrow function simplemente es una forma de hacerlo
  static async getById ({ id }) {
    const movie = movies.find(movie => movie.id === id)

    return movie
  }

  static async create ({ input }) {
    const newMovie = {
      id: randomUUID(),
      ...input
    }
    movies.push(newMovie)

    return newMovie
  }

  static async update ({ id, input }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return null

    const updatedMovie = {
      ...movies[movieIndex],
      ...input
    }

    movies[movieIndex] = updatedMovie

    return updatedMovie
  }

  // se envía un objeto con el id para que se pueda extender el método en el futuro y para saber que es lo que se está enviando
  static async delete ({ id }) {
    const movieIndex = movies.findIndex(movie => movie.id === id)
    if (movieIndex === -1) return false
    movies.splice(movieIndex, 1)
    return true
  }
}
