import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    setNotification: (state, action) => action.payload,
    clearNotification: () => '',
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const showNotification = (message, timeout) => {
  return async dispatch => {
    dispatch(setNotification(message))
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer