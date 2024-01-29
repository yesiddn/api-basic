import { createApp } from './app.js'
import { MovieModel } from './models/mysql/movie.js' // patron inyección de dependencias

// de esta forma podemos tener varios servicios con diferentes modelos de datos
createApp({ movieModel: MovieModel })
