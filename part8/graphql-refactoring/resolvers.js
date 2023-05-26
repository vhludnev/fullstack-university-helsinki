const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => {
      const authors = await Author.find({})

      return authors.map(a => {
        const author = {
          id: a._id.toString(),
          name: a.name,
          born: a.born,
          bookCount: Book.collection.countDocuments({ author: a._id }),
        }
        return author
      })
    },
    findAuthor: async (root, args) => Author.findOne({ name: args.name }),

    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const allBooks = await Book.find({}).populate('author')
      return Object.keys(args).length
        ? allBooks.filter(b => b.author.name === args.author || b.genres.includes(args.genre))
        : allBooks
    },
    findBook: async (root, args) => Book.findOne({ title: args.title }).populate('author'),

    me: (root, args, context) => {
      return context.currentUser
    },
  },

  Mutation: {
    addAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const authorExists = await Author.findOne({ name: args.name })
      if (authorExists) {
        throw new GraphQLError('Name must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }
      const author = new Author({ ...args })

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      pubsub.publish('AUTHOR_ADDED', { authorAdded: author })

      return author
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const author = await Author.findOne({ name: args.name })
      author.born = args.setBornTo

      try {
        author.save()
      } catch (error) {
        throw new GraphQLError('Saving year born failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }

      const updatedAuthor = {
        id: author._id,
        name: author.name,
        born: author.born,
        bookCount: await Book.collection.countDocuments({ author: author._id }),
      }
      return updatedAuthor
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const bookTitleExists = await Book.findOne({ title: args.title })

      if (bookTitleExists) {
        throw new GraphQLError('Title must be unique', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      if (args.title.length < 5) {
        throw new GraphQLError('Title is too short (min 5)', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      if (args.author.length < 4) {
        throw new GraphQLError('Author name is too short (min 4)', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }

      let book
      try {
        const authorExists = await Author.findOne({ name: args.author })

        if (!authorExists) {
          const author = new Author({ name: args.author })

          author.bookCount = await Book.collection.countDocuments({ author: author._id })
          book = new Book({ ...args, author: author._id })
          await author.save()
        } else {
          book = new Book({ ...args, author: authorExists._id })
        }
        await book.save()
      } catch (error) {
        throw new GraphQLError('Saving book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })

      return book.populate('author')
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    editUser: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const user = await User.findOne({ username: currentUser.username })
      user.favoriteGenre = args.setGenreTo

      try {
        user.save()
      } catch (error) {
        throw new GraphQLError('Saving favorite genre failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: currentUser.username,
            error,
          },
        })
      }

      return user
    },
  },
  Subscription: {
    authorAdded: {
      subscribe: () => pubsub.asyncIterator('AUTHOR_ADDED'),
    },
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED'),
    },
  },
}

module.exports = resolvers
