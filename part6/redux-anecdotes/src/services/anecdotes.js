const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('server error')
  }

  return response.json()
}

export const createAnecdote = async (newAnecdote) => {
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newAnecdote)
  })

  if (!response.ok) {
    throw new Error('failed to create anecdote')
  }

  return response.json()
}

export const updateAnecdote = async (updatedAnecdote) => {
  const response = await fetch(
    `http://localhost:3001/anecdotes/${updatedAnecdote.id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedAnecdote)
    }
  )

  return response.json()
}
