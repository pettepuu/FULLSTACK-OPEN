import { useEffect } from 'react'
import React from 'react'
import AnecdoteForm from './components/AnecdoteForm.jsx'
import AnecdoteList from './components/AnecdoteList.jsx'
import Filter from './components/Filter.jsx'
import Notification from './components/Notification.jsx'
import { useDispatch } from 'react-redux'
import { initializeAnecdotes } from './reducers/anecdoteSlice'

const App = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [dispatch])
  

  return (
    <div>
      <Notification /> 
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App