import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'
import { Button, Paper } from '@mui/material'

const Togglable = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <Paper
      elevation={0}
      sx={{
        mt: '1rem',
      }}
    >
      <div style={hideWhenVisible} className='togglableContent'>
        <Button
          sx={{
            mb: '1rem',
          }}
          variant='contained'
          onClick={toggleVisibility}
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button
          sx={{
            mb: '1rem',
            ':hover': {
              color: 'orange',
            },
          }}
          variant='text'
          size='small'
          onClick={toggleVisibility}
        >
          cancel
        </Button>
      </div>
    </Paper>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}
