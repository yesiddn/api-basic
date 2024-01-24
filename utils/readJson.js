import { createRequire } from 'node:module'
const require = createRequire(import.meta.url) // es el import de arriba, pero además tiene unas propiedades especiales -> import.meta.url -> es la url del archivo actual

export const readJSON = (path) => require(path)
