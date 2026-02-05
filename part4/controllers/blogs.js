const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const title = request.body.title
  const url = request.body.url

  if (!title || !url || title.trim() === '' || url.trim() === '') {
    return response.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
})


module.exports = blogsRouter
