const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})

  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('id key exists within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach(blog => {
    expect(blog.id).toBeDefined()
  })
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'VH',
    url: 'https://wwww.example4.com',
    likes: 1,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const blogsAtEndNoIds = blogsAtEnd.map(({ id, ...rest }) => rest)
  expect(blogsAtEndNoIds).toContainEqual(newBlog)
})

test('blogs with no likes returned with likes = 0', async () => {
  const newBlog = {
    title: 'async/await is good for async calls',
    author: 'SK',
    url: 'https://wwww.example5.com',
  }

  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  expect(response.body.likes).toEqual(0)
})

test('400 Bad request if title or url not passed', async () => {
  const newBlog = {
    // title: 'async/await simplifies making async calls a lot',
    author: 'VH',
    url: 'https://wwww.example6.com',
  }

  await api.post('/api/blogs').send(newBlog).expect(400)
})

afterAll(async () => {
  await mongoose.connection.close()
})
