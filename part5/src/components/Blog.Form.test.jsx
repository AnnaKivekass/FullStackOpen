import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls createBlog with correct data when a new blog is created', async () => {
  const user = userEvent.setup()
  const mockCreateBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={mockCreateBlog} />)

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')

  await user.type(titleInput, 'Test title')
  await user.type(authorInput, 'Test author')
  await user.type(urlInput, 'https://example.com')

  const createButton = screen.getByRole('button', { name: /create/i })
  await user.click(createButton)

  expect(mockCreateBlog).toHaveBeenCalledTimes(1)
  expect(mockCreateBlog).toHaveBeenCalledWith({
    title: 'Test title',
    author: 'Test author',
    url: 'https://example.com'
  })
})
