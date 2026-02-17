import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotificationMessage(state, action) {
      return action.payload
    },
    clearNotification() {
      return ''
    }
  }
})

export const { setNotificationMessage, clearNotification } =
  notificationSlice.actions

let timeoutId = null

export const setNotification = (message, seconds) => {
  return dispatch => {

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    dispatch(setNotificationMessage(message))

    timeoutId = setTimeout(() => {
      dispatch(clearNotification())
      timeoutId = null
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer
