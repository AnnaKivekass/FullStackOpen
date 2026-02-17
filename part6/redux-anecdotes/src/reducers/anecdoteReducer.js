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

    createAnecdote(state, action) {
      state.push(action.payload)
      state.sort((a, b) => b.votes - a.votes)
    }

  }
})

export const { setAnecdotes, voteAnecdote, createAnecdote } = anecdoteSlice.actions
export default anecdoteSlice.reducer
export const initializeAnecdotes = () => {
  return async dispatch => {
    const response = await fetch('http://localhost:3001/anecdotes')
    const data = await response.json()
    dispatch(setAnecdotes(data))
  }
}
