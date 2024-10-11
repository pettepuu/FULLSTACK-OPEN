const { test, after, beforeEach, describe, expect } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(blogs)
  })
describe('get-testit', () => {
    test('there are five notes', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, blogs.length)
    })
      
    test('blogs are returned as json', async () => {
        const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/);

        const blogs = response.body;
        blogs.forEach(blog => {
          assert(blog.id, 'Blog should has id');
          assert.strictEqual(blog._id, undefined, '_id is wrong type of id');
        });
        
    });
})

describe('Post-testit', () => {
    test('new blog is added', async () => {
      const newBlog = {
        title: "Maunon elämä ja teot",
        author: "Mauno Mattila",
        url: "www.maunoelamajateot",
        likes: 1123
      };
  
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
  
      const response = await api.get('/api/blogs');
      const blogsAtEnd = response.body;
      
      assert.strictEqual(blogsAtEnd.length, blogs.length + 1);

    });

    test('new blog without title or url', async () => {
        const newBlog = {
            title: "",
            author: "Hilarius Hiiri",
            url: "",
            likes: 4124
        };
    
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400);

    })

  
    test('new blog is added without likes', async () => {
      const newBlog = {
        title: "Jyrkin ruuanlaitto-opas",
        author: "Jyrki S",
        url: "www.jsruoka.fi"
      };
  
      const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);
  
      const savedBlog = response.body;
      assert.strictEqual(savedBlog.likes, 0);
    });

    test('deleteblogID', async () => {
        const response = await api.get('/api/blogs')
        const newBlog = {
            title: "Game of Thrones",
            author: "George R. R. Martin",
            url: "https://GOT.fi",
            likes: 12345
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)

        const remove = response.body.at(-1).id
        console.log(remove)
        await api
            .delete(`/api/blogs/${remove}`)
            .expect(404);

    })

    test('updateblogID', async () => {
        const response = await api.get('/api/blogs')
        console.log(response.body.at(-1).id)
        const changedLikes = {
            likes: 12211
        }

        await api
            .put(`/api/blogs/${response.body.at(-1).id}`)
            .send(changedLikes)
            .expect(200)

        const responseRerun = await api.get('/api/blogs')
        const updatedBlog = responseRerun.body.find(b => b.id === response.body.at(-1).id)
        assert.strictEqual(updatedBlog.likes, 12211);
    

    })
});
describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('when there is initially one user at db', () => {
  // ...

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

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

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
    await mongoose.connection.close()
  });