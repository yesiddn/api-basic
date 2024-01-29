import express, { json } from 'express'
import { createMoviesRouter } from './routes/movies.js'
import { corsMiddleware } from './middlewares/cors.js'
// import { MovieModel } from './models/mysql/movie.js' // import sin usar export createApp pero no se podria tener varios servicios con diferentes modelos de datos

export const createApp = ({ movieModel }) => {
  const app = express()
  app.use(json())

  app.use(corsMiddleware())
  app.disable('x-powered-by')

  const PORT = process.env.PORT ?? 3000

  // app.use('/movies', createMoviesRouter({ movieModel: MovieModel })) // de esta forma cargamos las rutas de movies -> inyección de dependencias desde el origen o punto de entrada
  app.use('/movies', createMoviesRouter({ movieModel })) // dentro del export createApp

  app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`)
  })

  return app
}
