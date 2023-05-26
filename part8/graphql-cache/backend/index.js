const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connection to MongoDB:', error.message)
  })

let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
 */

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID! 
  }

  type Book {
    title: String!
    id: ID!
    published: Int!
    author: Author!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    authorCount: Int!
    allAuthors: [Author!]!
    findAuthor(name: String!): Author

    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]
    findBook(title: String!): Book

    me: User
  }

  type Mutation {
    addAuthor(
      name: String!
      born: Int
    ): Author

    editAuthor(    
      name: String!    
      setBornTo: Int!    
    ): Author

    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book

    createUser(
      username: String!
      favoriteGenre: String!
    ): User

    login(
      username: String!
      password: String!
    ): Token

    editUser(        
      setGenreTo: String!    
    ): User
  }
`

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
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null

    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
