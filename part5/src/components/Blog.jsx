import { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }
  
  const ownerUsername = blog.user?.username
  const ownerId = blog.user?.id || blog.user?._id || blog.user
  const currentUserId = user?.id || user?._id

  const isOwner =
    (ownerUsername && ownerUsername === user?.username) ||
    (ownerId && currentUserId && ownerId === currentUserId)

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      {visible && (
        <div className="blogDetails">
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}{' '}
            <button onClick={() => handleLike(blog)}>like</button>
          </div>

          <div>{blog.user?.name}</div>

          {isOwner && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
