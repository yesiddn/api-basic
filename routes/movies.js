import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'
// import { MovieModel } from '../models/mysql/movie.js' // inyección de dependencias pero en el lugar incorrecto

export const createMoviesRouter = ({ movieModel }) => { // export nombrado (se ve mejor que el export default)
  const moviesRouter = Router()

  const movieController = new MovieController({ movieModel })

  moviesRouter.get('/', movieController.getAll)
  moviesRouter.post('/', movieController.create)

  moviesRouter.get('/:id', movieController.getById)
  moviesRouter.patch('/:id', movieController.update)
  moviesRouter.delete('/:id', movieController.delete)

  return moviesRouter
}
// export default router // una forma de exportar
