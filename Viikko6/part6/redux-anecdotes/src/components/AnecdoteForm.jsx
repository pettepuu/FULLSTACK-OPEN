import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteSlice'
import { showNotification } from '../reducers/notificationSlice'

const AnecdoteForm = () => {
  const dispatch = useDispatch()
  const [content, setContent] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(createAnecdote(content))
    dispatch(showNotification(`Added: ${content}`, 10))
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter new anecdote"
        />
      </div>
      <button type="submit">Add anecdote</button>
    </form>
  )
}

export default AnecdoteForm