import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {

    setAnecdotes(state, action) {
      return action.payload
    },

    voteAnecdote(state, action) {
      const id = action.payload
      const anecdoteToVote = state.find(a => a.id === id)

      anecdoteToVote.votes += 1

      state.sort((a, b) => b.votes - a.votes)
    },

    
    appendAnecdote(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.votes - a.votes)
    }

  }
})

export const { setAnecdotes, voteAnecdote, appendAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
export const initializeAnecdotes = () => {
  return async dispatch => {
    const response = await fetch('http://localhost:3001/anecdotes')
    const data = await response.json()
    dispatch(setAnecdotes(data))
  }
}

export const createAnecdote = (content) => {
  return async dispatch => {

    const newAnecdote = {
      content,
      votes: 0
    }

    const response = await fetch('http://localhost:3001/anecdotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newAnecdote)
    })

    const savedAnecdote = await response.json()

    dispatch(appendAnecdote(savedAnecdote))
  }
}
