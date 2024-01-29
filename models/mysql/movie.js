// import mysql from 'mysql2' // usa callbacks
import mysql from 'mysql2/promise' // usa promises

const config = {
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'movies'
}

const connection = await mysql.createConnection(config)

// connection.query('SELECT ...', (err, results) => {
//   // ❌
// }) // de esta forma nos obliga a usar callbacks, que no esta mal porque funciona pero complica el código

export class MovieModel {
  static async getAll ({ genre }) {
    // const [movies, dbFields] -> movies es un array de objetos, dbFields es un array de objetos con información de los campos
    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie')

    return movies
  }

  static async getById ({ id }) {
    const [movies] = await connection.query('SELECT BIN_TO_UUID(id) id, title, year, director, duration, poster, rate FROM movie WHERE id = UUID_TO_BIN(?)', [id])

    if (movies.length === 0) return null

    return movies[0]
  }

  static async create ({ input }) {
    const {
      genre: genreInput, // genre is an array
      title,
      year,
      duration,
      director,
      poster,
      rate
    } = input

    // crear uuid con crypto
    // const id = crypto.randomUUID()

    // crear uuid con mysql
    const [uuidResult] = await connection.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult

    // insertar en la tabla movie_genre
    // const promises = genreInput.map(async genre => {
    //   const [genreResult] = await connection.query('SELECT id FROM genre WHERE name = ?', [genre])
    //   const [{ id: genreId }] = genreResult

    //   await connection.query('INSERT INTO movie_genre (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?)', [uuid, genreId])
    // })

    // try {
    //   await Promise.all(promises)
    // } catch (error) {
    //   throw new Error('Error creating movie')
    // }

    try {
      await connection.query('INSERT INTO movie (id, title, year, duration, director, poster, rate) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)', [uuid, title, year, duration, director, poster, rate])
    } catch (error) {
      // No mostrar error al usuario, porque puede contener información sensible
      throw new Error('Error creating movie')
      // enviar a un servicio interno
      // enviar un correo al administrador
    }

    const movie = {
      id: uuid,
      title,
      year,
      duration,
      director,
      poster,
      rate,
      genre: genreInput
    }

    return movie
  }

  static async update ({ id, input }) {

  }

  static async delete ({ id }) {

  }
}
