require('dotenv').config()

const app = require('./app')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
console.log('typeof Blog:', typeof Blog)

const mongoUrl = process.env.MONGODB_URI

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.message)
  })

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

