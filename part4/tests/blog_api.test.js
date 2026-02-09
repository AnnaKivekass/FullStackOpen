const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const { default: expect } = require('expect')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

require('../mongo')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  { title: 'a', author: 'x', url: 'http://a', likes: 1 },
  { title: 'b', author: 'y', url: 'http://b', likes: 2 },
]

describe('blog api', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = new User({
      username: 'rootuser',
      name: 'Root',
      passwordHash: 'fakehash',
    })
    const savedUser = await user.save()

    const blogsWithUser = initialBlogs.map((b) => ({
      ...b,
      user: savedUser._id,
    }))

    const savedBlogs = await Blog.insertMany(blogsWithUser)

    savedUser.blogs = savedBlogs.map((b) => b._id)
    await savedUser.save()
  })

  test('GET /api/blogs returns correct amount of blogs as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length)
  })

  test('returned blogs have id field (and not _id)', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]

    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })

  test('returned blogs use id, not _id (and __v is removed)', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      expect(blog.id).toBeDefined()
      expect(blog._id).toBeUndefined()
      expect(blog.__v).toBeUndefined()
    })
  })

  test('a valid blog can be added with POST /api/blogs', async () => {
    const newBlog = {
      title: 'async/await makes tests nicer',
      author: 'Test Author',
      url: 'https://example.com/await',
      likes: 123,
    }

    const blogsAtStart = (await api.get('/api/blogs')).body

    const created = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = (await api.get('/api/blogs')).body
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
    assert(blogsAtEnd.map((b) => b.title).includes(newBlog.title))

    expect(created.body.user).toBeDefined()
  })

  test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'no likes given',
      author: 'someone',
      url: 'https://example.com/nolikes',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('blog without title is rejected with 400', async () => {
    const newBlog = {
      author: 'No Title',
      url: 'https://example.com/notitle',
      likes: 5,
    }

    const blogsAtStart = (await api.get('/api/blogs')).body

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = (await api.get('/api/blogs')).body
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('blog without url is rejected with 400', async () => {
    const newBlog = {
      title: 'No URL',
      author: 'Someone',
      likes: 3,
    }

    const blogsAtStart = (await api.get('/api/blogs')).body

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = (await api.get('/api/blogs')).body
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  test('a blog can be deleted with DELETE /api/blogs/:id', async () => {
    const blogsAtStart = (await api.get('/api/blogs')).body
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = (await api.get('/api/blogs')).body
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const ids = blogsAtEnd.map((b) => b.id)
    assert(!ids.includes(blogToDelete.id))
  })

  test('a blog likes can be updated with PUT /api/blogs/:id', async () => {
    const blogsAtStart = (await api.get('/api/blogs')).body
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { likes: blogToUpdate.likes + 10 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, updatedData.likes)

    const blogsAtEnd = (await api.get('/api/blogs')).body
    const updatedFromDb = blogsAtEnd.find((b) => b.id === blogToUpdate.id)
    assert.strictEqual(updatedFromDb.likes, updatedData.likes)
  })
})

after(async () => {
  await mongoose.connection.close()
})
