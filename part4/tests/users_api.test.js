const { test, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

require('../mongo')
const mongoose = require('mongoose')
const User = require('../models/user')

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

describe('user api', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({
      username: 'rootuser',
      name: 'Root',
      passwordHash: 'fakehash'
    })
    await user.save()
  })

  test('fails with 400 if username is missing', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      name: 'No Username',
      password: 'salainen'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(res.body.error)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if username is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'salainen'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(res.body.error)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if password is missing', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'No Password'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(res.body.error)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if password is too short', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'validuser',
      name: 'Short Password',
      password: '12'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(res.body.error)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('fails with 400 if username is not unique', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'rootuser',
      name: 'Duplicate',
      password: 'salainen'
    }

    const res = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    assert(res.body.error)
    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('succeeds with 201 when data is valid', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  })
})

test('close connection', async () => {
  await mongoose.connection.close()
})
