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
      favoriteGenre: String
    ): User

    login(
      username: String!
      password: String!
    ): Token

    editUser(        
      setGenreTo: String!    
    ): User
  }

  type Subscription {
    authorAdded: Author

    bookAdded: Book
  }
`
module.exports = typeDefs
