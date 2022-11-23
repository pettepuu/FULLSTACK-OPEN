const express = require('express')
require('express-async-errors')
const app = express()
const blogsRouter = require("./controllers/blogs")
const usersRouter = require('./controllers/users')
const cors = require('cors')
const mongoose = require('mongoose')
const loginRouter = require('./controllers/login')

const mongoUrl = 'mongodb+srv://ppuusti:6E9zJKmDXM.xcpm@cluster0.fhcfptr.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(mongoUrl)
.then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)


module.exports = app