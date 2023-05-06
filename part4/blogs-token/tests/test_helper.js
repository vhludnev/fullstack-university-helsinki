const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'VH',
    url: 'https://wwww.example.com',
    likes: 2,
    user: '64550931049dc3e2772e0420',
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'SH',
    url: 'https://wwww.example2.com',
    likes: 4,
    user: '64550931049dc3e2772e0420',
  },
  {
    title: 'Postman is good in testing backend',
    author: 'VH',
    url: 'https://wwww.example3.com',
    user: '64550931049dc3e2772e0420',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    url: 'https://wwww.example3.com8',
    user: '64550931049dc3e2772e0420',
  })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}
