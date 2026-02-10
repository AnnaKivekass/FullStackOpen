import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author, but url and likes are hidden by default', () => {
  const blog = {
    title: "Things I Don’t Know as of 2018",
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 12,
    user: { username: 'anna', name: 'Anna' },
  }

  render(<Blog blog={blog} />)

  expect(screen.getByText(/Things I/)).toBeInTheDocument()
  expect(screen.getByText(/Dan Abramov/)).toBeInTheDocument()

  expect(screen.queryByText(blog.url)).toBeNull()
  expect(screen.queryByText(/likes/i)).toBeNull()
})
