import Togglable from './Togglable'
import loginService from '../services/login'
import { useState } from 'react'
import { useNotify } from '../NotificationContext'
import { useSetUser } from '../UserContext'
import { TextField, Button, Typography } from '@mui/material'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const addNewUser = useSetUser()
  const notifyWith = useNotify()

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      addNewUser(user)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      setUsername('')
      setPassword('')
      notifyWith(`User ${user.username} logged in`)
    } catch (exception) {
      notifyWith(exception.response.data.error)
    }
  }

  return (
    <Togglable buttonLabel='log in'>
      <Typography variant='h3'>Login</Typography>

      <form onSubmit={handleLogin} id='login-form'>
        <div>
          <TextField size='small' label='username' onChange={e => setUsername(e.target.value)} />
        </div>
        <div>
          <TextField
            sx={{ my: '.5rem' }}
            size='small'
            label='password'
            type='password'
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <Button sx={{ mt: '1rem' }} variant='contained' color='primary' type='submit'>
          login
        </Button>
      </form>
    </Togglable>
  )
}

export default LoginForm
