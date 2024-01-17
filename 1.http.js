const http = require('node:http')
const fs = require('node:fs')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8') // charset=utf-8 para que se muestren los acentos

  if (req.url === '/') {
    res.statusCode = 200 // OK
    res.end('Bienvenido a mi página de inicio')
  } else if (req.url === '/league-of-legends.jpg') {
    fs.readFile('lol.jpg', (err, data) => {
      if (err) {
        res.statusCode = 500 // Internal Server Error
        res.end('Internal Server Error')
      } else {
        res.setHeader('Content-Type', 'image/jpg')
        res.end(data) // data es un buffer que el navegador puede interpretar gracias al Content-Type
      }
    })
  } else if (req.url === '/contacto') {
    res.statusCode = 200 // OK
    res.end('Bienvenido a mi página de contacto')
  } else {
    res.statusCode = 404 // Not Found
    res.end('Página no encontrada')
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server running at port ${desiredPort}`)
})
