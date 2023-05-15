import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

const blog = {
  title: 'Postman is good',
  author: 'VH',
  url: 'https://wwww.example.com',
  likes: 2,
  user: '64550931049dc3e2772e0420',
}

test('does not render this', () => {
  render(<Blog blog={blog} />)

  const element = screen.queryByText('https://wwww.example.com')
  expect(element).toBeNull()
})

test('renders title and author', () => {
  render(<Blog blog={blog} />)

  const element = screen.getByText('Postman is good VH')
  //const element = await screen.findByText('Postman is good')

  expect(element).toBeDefined()
})

test('renders title and author - className', () => {
  render(<Blog blog={blog} />)
  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.blog')
  expect(div).toHaveTextContent('Postman is good VH')
})

test('clicking the button view make url and likes number visible', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const { container } = render(<Blog blog={blog} />)
  const div = container.querySelector('.nonvisiblecontent')
  expect(div).toBeDefined()

  const url = screen.queryByText('https://wwww.example.com')
  expect(url).not.toBeNull()

  const likes = screen.queryByText('likes 2')
  expect(likes).not.toBeNull()
})

test('if the like button is clicked twice, the event handler the component received as props is called twice', async () => {
  const mockHandler = jest.fn()

  render(<Blog blog={blog} updateLikes={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
