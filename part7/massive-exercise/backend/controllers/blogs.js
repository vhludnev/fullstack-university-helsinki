const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(request.userId)

  const blog = new Blog({ ...body, user: user.id })

  const savedBlog = await blog.save()
  const populatedNewBlog = await savedBlog.populate('user', { name: 1 })

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(populatedNewBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id, { user: 1, _id: 0 })

  if (request.userId === blog.user.toString()) {
    const user = await User.findById(request.userId)
    user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
    await user.save()

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(403).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const body = request.body
  const blog = { ...body }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', { name: 1 })

  response.status(200).json(updatedBlog)
})

blogsRouter.post('/:id/comments', async (request, response) => {
  const body = request.body

  const blog = await Blog.findById(request.params.id)

  if (blog) {
    blog.comments.push(body)
    const updatedBlog = await blog.save()

    response.status(201).json(updatedBlog)
  } else {
    response.status(404)
    throw new Error('Blog not found')
  }
})

module.exports = blogsRouter
