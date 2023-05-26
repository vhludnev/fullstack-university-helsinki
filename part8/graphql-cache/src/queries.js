import { gql } from '@apollo/client'

export const GET_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      id
    }
  }
`

export const FIND_AUTHOR = gql`
  query findAuthorByName($nameToSearch: String!) {
    findAuthor(name: $nameToSearch) {
      name
      born
      bookCount
      id
    }
  }
`

export const ALL_BOOKS = gql`
  query findAllBooks($author: String, $genre: String) {
    allBooks(author: $author, genre: $genre) {
      title
      id
      published
      author {
        name
        id
      }
      genres
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($setGenreTo: String!) {
    editUser(setGenreTo: $setGenreTo) {
      username
      favoriteGenre
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String!]) {
    addBook(title: $title, published: $published, author: $author, genres: $genres) {
      title
      published
      id
      author {
        name
        id
      }
      genres
    }
  }
`

export const UPDATE_BORN = gql`
  mutation updateBorn($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
