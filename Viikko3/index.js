require('dotenv').config()
const express = require('express')
const Person = require('./models/person')
const app = express()
var morgan = require('morgan')
app.use(express.static('build'))
const cors = require('cors')
app.use(cors())


  app.use(express.json())
  
  const idGenerator = () => Math.floor(Math.random() * 5000)

  morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : '' })
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

  app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })

})

  app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'missing content' })
    }
    
    const person = new Person({
      name: body.name,
      number: body.number,
      id: idGenerator(),
    })
  
    person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  })

app.get('/info', (request, response) => {
  Person.find().count(function (err, count) {
    response.send(
        `<p>Phone book has info for ${count} people </p>` +
        `<p> ${new Date()} </p>`
    )
})
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
  
  app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
      .then(persons => {
        if (persons) {
          response.json(persons)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
  
    Person.findByIdAndUpdate(
      request.params.id, 
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    ) 
      .then(person => {
        response.json(person)
      })
      .catch(error => next(error))
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
    next(error)
  }

  app.use(errorHandler)

  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

//https://damp-citadel-00056.herokuapp.com/