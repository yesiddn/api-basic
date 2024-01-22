const z = require('zod')

// las APIs deben ser robustas, no deben fallar por datos malos (tipo embudo, solo deja pasar lo bueno)
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required'
  }).min(1).max(255),
  year: z.number().int().min(1888).max(2024),
  director: z.string().min(1).max(255),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0), // .optional() o .nullable()
  poster: z.string().url({
    message: 'Movie poster must be a valid URL'
  }), // .endsWith('.jpg')
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Sci-Fi', 'Thriller', 'Western']),
    {
      required_error: 'Movie genre is required',
      invalid_type_error: 'Movie genre must be an array of enum Genre'
    }
  ).min(1).max(5)
})

function validateMovie (object) {
  // return movieSchema.parse(object) // retorna un objeto con los atributos que se definieron en el schema
  return movieSchema.safeParse(object) // retorna un objeto con un atributo success que es un booleano
}

function validatePartialMovie (object) { // shape, input, object -> hasta que no se sepa que es un movie no se llama movie
  return movieSchema.partial().safeParse(object) // partial() -> hace que todos los atributos sean opcionales y se validan solo los que lleguen en el objeto
}

module.exports = { validateMovie, validatePartialMovie }
