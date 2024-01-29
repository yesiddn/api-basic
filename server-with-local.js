import { createApp } from './app.js'
import { MovieModel } from './models/local-file-system/movie.js' // patron inyección de dependencias

createApp({ movieModel: MovieModel })
