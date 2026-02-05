const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

require('../mongo')
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const initialBlogs = [
  { title: 'a', author: 'x', url: 'http://a', likes: 1 },
  { title: 'b', author: 'y', url: 'http://b', likes: 2 },
]

describe('GET /api/blogs', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })

  test('returns correct amount of blogs as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

test('returned blogs have id field', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  assert.ok(blog.id)
  assert.strictEqual(blog._id, undefined)
})

after(async () => {
  await mongoose.connection.close()
})


