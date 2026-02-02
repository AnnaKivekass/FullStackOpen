require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const path = require('path')
const Person = require('./models/person')

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => res.json(persons))
    .catch(next)
})

app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const now = new Date()
      res.send(`
        <p>Phonebook has info for ${count} people</p>
        <p>${now}</p>
      `)
    })
    .catch(next)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end()
      res.json(person)
    })
    .catch(next)
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (!result) return res.status(404).json({ error: 'person not found' })
      res.status(204).end()
    })
    .catch(next)
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name) return res.status(400).json({ error: 'name missing' })
  if (!number) return res.status(400).json({ error: 'number missing' })

  const person = new Person({ name, number })

  person.save()
    .then(savedPerson => res.json(savedPerson))
    .catch(next)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message)

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
