const express = require('express')
const app = express()

const PORT = process.env.PORT ?? 3000

app.get('/', (req, res) => {
  // res.status(200).send('<h1>Home</h1>')
  // res.send('<h1>Home</h1>')
  res.json({ message: 'Home' })
})

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`)
})
