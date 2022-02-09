require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const db = require('./db')
const models = require('./models/index')
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')

const PORT = process.env.PORT || 8080
const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
  try {
    await db.authenticate()
    await db.sync()
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (err) {
    console.log(err)
  }
}

start()