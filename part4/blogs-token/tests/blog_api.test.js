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

describe('when there is initially some blogs saved', () => {
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

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)
    expect(titles).toContain('Browser can execute only JavaScript')
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToView = blogsAtStart[0]

    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(resultBlog.body).toEqual(blogToView)
  })

  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonexistingId = await helper.nonExistingId()

    await api.get(`/api/blogs/${validNonexistingId}`).expect(404)
  })

  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
})

describe('addition of a new blog', () => {
  test('id key exists within the returned blogs', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls for sure',
      author: 'VH',
      url: 'https://wwww.example4.com',
      likes: 1,
      userId: '64552739ecd813e1ea0fd227',
    }
    const token =
      'eyJhbGciOiJIUzIjuiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjY0NTUwOGQ3MDQ5ZGMzZTI3NzJlMDQxYiIsImlhdCI6MTY4MzM2NzQ1NSwiZXhwIjoxNjgzMzc0NjU1fQ.Cg2eY2uHFvYn13qqOwWrjjKXpxzxyTKW3ULf9FeXGwE'

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const blogsAtEndTitles = blogsAtEnd.map(r => r.title)
    expect(blogsAtEndTitles).toContain('async/await simplifies making async calls for sure')
  })

  test('no token provided a valid blog can not be added', async () => {
    const newBlog = {
      title: 'async/await simplifies making async calls',
      author: 'VH',
      url: 'https://wwww.example4.com',
      likes: 1,
      userId: '64552739ecd813e1ea0fd227',
    }

    await api.post('/api/blogs').send(newBlog).set('Authorization', 'Bearer ').expect(401)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
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

  test('fails with status code 400 if sent without providing all required data', async () => {
    const newBlog = {
      // title: 'async/await simplifies making async calls a lot',
      author: 'VH',
      //url: 'https://wwww.example6.com',
    }

    await api.post('/api/blogs').send(newBlog).expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1)

    const ids = blogsAtEnd.map(b => b.id)
    expect(ids).not.toContain(blogToDelete.id)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlogData = {
      likes: blogToUpdate.likes + 1,
      // title: 'title can also be updated',
      // url: 'http://as-well-as-url.com',
    }

    await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlogData).expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
