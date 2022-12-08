require('dotenv').config() // need to be before import any models from mongoose/MongoDB
// let persons = require('./data.json');
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')


app.use(express.static('build')) // express show static content, the page index.html and the JavaScript
app.use(express.json()) // Json parser allows json data sent with http request for logger middleware or POST route handler, otheriwse request body would be undefined
app.use(cors())
morgan.token('body', function getId (req) {
  console.log(req.body)
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body' ))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get('/info', (request, response, next) => {
  Person
    .count({})
    .then(result => {
      response.send(`<h1>there are ${result} people in the database</h1>`)
    })
    .catch(error => next(error))

})

/* not sure how to test the get by id method, below is reference to previous code and comparison code to Note*/
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {  // uses mongoose findById method
      if (person) { // if an actual person (and not null)
        response.json(person)
      } else {
        // If no matching object is found in the database, the value of note will be null and the else block is executed.
        // This results in a response with the status code 404 not found.
        response.status(404).end()
      }
    })
    .catch(error => next(error)) //next function called with parameter -> continue to error handler middleware
    //If promise returned by the findById method is rejected, the response will have the status code 500 internal server error.
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end() // status code no content
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date()
  })

  person
    .save()
    .then(savedPerson => {
      console.log('saved person to data base')
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
  }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' } // mongoose doesn't automatically run validation. To trigger this, you need to pass a configuration object
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}
// this has to be the last loaded middleware.
app.use(errorHandler)


const PORT = process.env.PORT || '3001'
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})