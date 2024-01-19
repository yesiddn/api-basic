const http = require('node:http')

// import JSON file
const dittoJSON = require('./pokemon/ditto.json')
const { log } = require('node:console')

const desiredPort = process.env.PORT ?? 3000

const processRequest = (req, res) => {
  const { method, url } = req

  switch (method) {
    case 'GET':
      switch (url) {
        case '/pokemon/ditto':
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify(dittoJSON))
          break

        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('404 Not Found')
          break
      }
      break
    case 'POST':
      switch (url) {
        case '/pokemon': {
          let body = ''

          // evento data que se dispara cuando llegan datos
          req.on('data', (chunk) => {
            body += chunk.toString()
            // console.log('chunk', chunk.toString())
          })

          req.on('end', () => {
            const data = JSON.parse(body)
            // console.log(data)

            // otra forma de escribir el header
            res.writeHead(201, {
              'Content-Type': 'application/json; charset=utf-8'
            })
            res.end(JSON.stringify(data))
          })

          break
        }

        default:
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/html; charset=utf-8')
          res.end('404 Not Found')
          break
      }
      break

    default:
      break
  }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
  console.log(`Server listening on port http://localhost:${desiredPort}`)
})
