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

blogsRouter.delete('/:id', async (request, response) => {
  const deleted = await Blog.findByIdAndDelete(request.params.id)

  if (!deleted) {
    return response.status(404).end()
  }

  return response.status(204).end()
})

module.exports = blogsRouter
