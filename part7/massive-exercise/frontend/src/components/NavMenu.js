import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNotify } from '../NotificationContext'
import { useUserData, useRemoveUser } from '../UserContext'
import { AppBar, Button, Stack, Toolbar } from '@mui/material'

const NavMenu = () => {
  const notifyWith = useNotify()
  const getUser = useUserData()
  const removeUser = useRemoveUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    removeUser()
    window.localStorage.removeItem('loggedBlogappUser')

    notifyWith('User logged out')
    navigate('/')
  }

  const padding = {
    paddingTop: 5,
    color: 'aqua',
  }

  return (
    <AppBar position='static'>
      <Toolbar>
        <Stack direction='row' spacing={2}>
          <Button
            color='inherit'
            sx={{
              ':hover': {
                bgcolor: 'primary.main',
                color: 'lime',
              },
            }}
            component={Link}
            to='/'
          >
            blogs
          </Button>
          <Button
            color='inherit'
            sx={{
              ':hover': {
                bgcolor: 'primary.main',
                color: 'lime',
              },
            }}
            component={Link}
            to='/users'
          >
            users
          </Button>
          <em style={padding}>{getUser.name} logged in</em>
          <Button
            sx={{
              ':hover': {
                bgcolor: 'primary.main',
                color: 'orange',
              },
            }}
            size='small'
            color='inherit'
            onClick={handleLogout}
          >
            log out
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}

export default NavMenu
