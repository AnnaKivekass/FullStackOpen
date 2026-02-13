import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: "Things I Don’t Know as of 2018",
    author: 'Dan Abramov',
    url: 'https://overreacted.io/things-i-dont-know-as-of-2018/',
    likes: 12,
    user: { username: 'anna', name: 'Anna' },
  }

  test('renders title and author, but url and likes are hidden by default', () => {
    render(<Blog blog={blog} />)

    expect(screen.getByText(/Things I Don’t Know as of 2018/i)).toBeInTheDocument()
    expect(screen.getByText(/Dan Abramov/i)).toBeInTheDocument()

    expect(screen.queryByText(blog.url)).toBeNull()
    expect(screen.queryByText(/likes/i)).toBeNull()
  })

  test('url, likes ja käyttäjä näytetään kun view-nappia painetaan', async () => {
    render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByRole('button', { name: /view|show/i })
    await user.click(viewButton)

    expect(screen.getByText(blog.url)).toBeInTheDocument()

    expect(screen.getByText(/likes\s*12/i)).toBeInTheDocument()

    expect(screen.getByText(blog.user.name)).toBeInTheDocument()
  })
})
