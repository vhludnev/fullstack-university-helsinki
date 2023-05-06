const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'VH',
    url: 'https://wwww.example.com',
    likes: 2,
  },
  {
    title: 'Browser can execute only JavaScript',
    author: 'SH',
    url: 'https://wwww.example2.com',
    likes: 4,
  },
  {
    title: 'Postman is good in testing backend',
    author: 'VH',
    url: 'https://wwww.example3.com',
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
}
