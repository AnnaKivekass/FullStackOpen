const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

if (!url) {
  console.error('MONGODB_URI is missing (set it in Render Environment)')
  process.exit(1)
}

console.log('connecting to MongoDB...')

mongoose
  .connect(url)
  .then(() => {
    console.log('✅ connected to MongoDB')
  })
  .catch((error) => {
    console.error('error connecting to MongoDB:', error.name, error.message)
    process.exit(1)
  })
