import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteSlice'
import { showNotification } from '../reducers/notificationSlice'

const AnecdoteList = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)

  const filteredAnecdotes = filter
    ? anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
      )
    : anecdotes

  const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

  const vote = (id) => {
    dispatch(voteAnecdote(id))
    const votedAnecdote = anecdotes.find(anecdote => anecdote.id === id)
    dispatch(showNotification(`You voted for: "${votedAnecdote.content}"`, 10))
  }

  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList