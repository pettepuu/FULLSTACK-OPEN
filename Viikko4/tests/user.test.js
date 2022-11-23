const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')


describe('when there is initially one user at db', () => {
  test('return 400 error if username or password are less than three characters', async () => {
    const newUser = {
        username: "Ma",
        name: "Matias Alatalo",
        password: "234234asdasda"
    }
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const users = await User.find({})
    const usersAtStart = users.map(u => u.toJSON())

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const users1 = await User.find({})
    const usersAtEnd = users1.map(u => u.toJSON())
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})