import { useRef } from 'react'
import { useQuery } from 'react-query'
import { Routes, Route, useMatch, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import UserList from './components/UserList'
import NavMenu from './components/NavMenu'
import BlogInfo from './components/BlogInfo'
import UserInfo from './components/UserInfo'
import { useResource } from './hooks'
import { useUserData } from './UserContext'

const App = () => {
  const blogFormRef = useRef()

  const blogService = useResource('/api/blogs')
  const userService = useResource('/api/users')
  const currentUser = useUserData()

  const { data: blogs, isLoading } = useQuery('blogs', blogService.getResources, {
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const { data: users } = useQuery('users', userService.getResources, {
    retry: 1,
    refetchOnWindowFocus: false,
  })

  const matchBlog = useMatch('/blogs/:id')
  const blog = matchBlog ? blogs?.find(b => b.id === matchBlog.params.id) : null

  const matchUser = useMatch('/users/:id')
  const user = matchUser ? users?.find(u => u.id === matchUser.params.id) : null

  if (isLoading) {
    return <div>loading data...</div>
  }

  return (
    <Container>
      {currentUser && <NavMenu />}
      <h1 style={{ padding: '1rem 0' }}>Blog App</h1>
      <Notification />

      <Routes>
        <Route
          path='/blogs/:id'
          element={currentUser && blog ? <BlogInfo blog={blog} /> : <Navigate replace to='/login' />}
        />
        <Route path='/users' element={currentUser ? <UserList users={users} /> : <Navigate replace to='/login' />} />
        <Route
          path='/users/:id'
          element={currentUser && user ? <UserInfo user={user} /> : <Navigate replace to='/' />}
        />
        <Route path='/login' element={!currentUser ? <LoginForm /> : <Navigate replace to='/' />} />
        <Route
          path='/'
          element={currentUser ? <BlogList blogs={blogs} ref={blogFormRef} /> : <Navigate replace to='/login' />}
        />
      </Routes>
    </Container>
  )
}

export default App
