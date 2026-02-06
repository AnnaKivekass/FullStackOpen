const express = require('express')
const app = express()

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')

app.use(express.json())
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)

module.exports = app
