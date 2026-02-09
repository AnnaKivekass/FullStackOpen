const express = require('express')
const app = express()

const middleware = require('./utils/middleware')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') 
console.log('blogsRouter type:', typeof blogsRouter)
console.log('usersRouter type:', typeof usersRouter)
console.log('loginRouter type:', typeof loginRouter)


app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.errorHandler)

module.exports = app
