const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')
const api = supertest(app)


describe('bloglist tests', () => {
    
    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('correct id exists', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()

    })

    test('a valid blog can be added ', async () => {
        const newBlog = {
            title: "Game of Thrones",
            author: "George R. R. Martin",
            url: "https://georgerrmartin.com/notablog/",
            likes: 12345
        }

        const response = await api.get('/api/blogs')
      
        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)
      
        const response2 = await api.get('/api/blogs')
        const contents = response.body.map(r => r.title)

        expect(response2.body).toHaveLength(response.body.length +1)
        expect(contents).toContain('Game of Thrones')
      })


      test('if there is no likes', async () => {
        const newBlog = {
            title: "Game of Thrones",
            author: "George R. R. Martin",
            url: "https://georgerrmartin.com/notablog/"
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

            const responseAfter = await api.get('/api/blogs')
            expect(responseAfter.body.at(-1).likes === 0)
    })

    test('400 bad request', async () => {
        const newBlog = {
            author: "George R. R. Martin",
            likes: 177
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
    })

    test('delete by id', async () => {
        const response = await api.get('/api/blogs')
        const newBlog = {
            title: "12343212",
            author: "fghfghfghfgh",
            url: "https://georgerrmartin.com/notablog/"
    
        }

        await api
            .post('/api/blogs')
            .send(newBlog)

        const remove = response.body.at(-1).id

        await api
            .delete(`/api/blogs/${remove}`)
            .expect(204)
    })

    test('update by id', async () => {
        const response = await api.get('/api/blogs')
        const changelikesId = response.body.at(-1).id

        const newLikes = {
            likes: 4443
        }

        await api
            .put(`/api/blogs/${changelikesId}`)
            .send(newLikes)
            .expect(200)

        const response3 = await api.get('/api/blogs')
        const likesToContain = response3.body.map(r => r.likes)
        expect(likesToContain).toContain(4443)

    })
})

afterAll(() => {
  mongoose.connection.close()
})

