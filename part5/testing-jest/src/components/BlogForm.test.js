import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const inputs = screen.getAllByRole('textbox')

  const sendButton = screen.getByText('create')

  await user.type(inputs[0], 'testing title...')
  await user.type(inputs[1], 'testing author name...')
  await user.type(inputs[2], 'testing url...')

  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls).toContainEqual([{ title: 'testing title...', author: 'testing author name...', url: 'testing url...' }])
})
