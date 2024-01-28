import { Router } from 'express'

import { MovieController } from '../controllers/movies.js'

export const moviesRouter = Router() // export nombrado (se ve mejor que el export default)

moviesRouter.get('/', MovieController.getAll)
moviesRouter.post('/', MovieController.create)

moviesRouter.get('/:id', MovieController.getById)
moviesRouter.patch('/:id', MovieController.update)
moviesRouter.delete('/:id', MovieController.delete)

// export default router // una forma de exportar
