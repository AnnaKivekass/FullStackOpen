import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Things I Don’t Know as of 2018',
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 12,
    user: { username: 'anna', name: 'Anna' }
  }

  test('renders title and author, but hides url and likes by default', () => {
    render(<Blog blog={blog} />)

    expect(
      screen.getByText(/Things I Don’t Know as of 2018/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/Dan Abramov/i)).toBeInTheDocument()

    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })

  test('shows url, likes and user after clicking the view button', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByRole('button', { name: /view|show/i })
    await user.click(viewButton)

    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(
      screen.getByText(new RegExp(`likes\\s*${blog.likes}`, 'i'))
    ).toBeInTheDocument()
    expect(screen.getByText(blog.user.name)).toBeInTheDocument()
  })

  test('calls the like handler twice when like button is clicked twice', async () => {
    const mockLikeHandler = vi.fn()

    render(<Blog blog={blog} handleLike={mockLikeHandler} />)

    const user = userEvent.setup()

    const viewButton = screen.getByRole('button', { name: /view|show/i })
    await user.click(viewButton)

    const likeButton = screen.getByRole('button', { name: /like/i })
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler).toHaveBeenCalledTimes(2)
  })
})
