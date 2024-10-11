import { configureStore } from '@reduxjs/toolkit'
import filterReducer from '../reducers/filterSlice'
import notificationReducer from '../reducers/notificationSlice'
import anecdoteReducer from '../reducers/anecdoteSlice'

const store = configureStore({
  reducer: {
    anecdotes: anecdoteReducer,
    filter: filterReducer,
    notification: notificationReducer,
  },
})

export default store