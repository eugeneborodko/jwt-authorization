require('dotenv').config()
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use(cors())

const start = async () => {
  try {
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (err) {
    console.log(err)
  }
}

start()