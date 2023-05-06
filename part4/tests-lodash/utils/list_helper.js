const _ = require('lodash')

const dummy = blogs => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  const likes = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likes)

  return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = blogs => {
  const maxBlogsAuthor = _.maxBy(blogs, 'author').author
  const blogsQty = _.filter(blogs, { author: maxBlogsAuthor }).length

  const obj = {
    author: maxBlogsAuthor,
    blogs: blogsQty,
  }

  return obj
}

const mostLikes = blogs => {
  const authorGroupedBlogs = _.groupBy(blogs, 'author')
  const arrayOfObj = []
  _.forEach(authorGroupedBlogs, function (value, key) {
    arrayOfObj.push({ author: key, likes: _.sumBy(value, 'likes') })
  })

  const obj = _.maxBy(arrayOfObj, 'likes')

  return obj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
