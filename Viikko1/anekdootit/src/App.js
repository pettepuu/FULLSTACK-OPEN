import { useState } from "react"

const Button = ({ handleClick, text }) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const BestAnecdote = ({ title, bestAnecdote, anecdotes }) => {
  return (
    <div>
      <h1> {title} </h1>
      {anecdotes[bestAnecdote]} 
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]


  const [selected, setSelected] = useState(0)
  const [vote, setVotes] = useState(Array.apply(null, new Array(7)).map(Number.prototype.valueOf, 0))
  const [bestAnecdote, setBestAnecdote] = useState(0)


  const satunnaisNumero = () => setSelected(Math.floor(Math.random() * 7))

  const voteAnecdote = () => {
    const copy = { ...vote }
    copy[selected] += 1
    setVotes(copy)

    if (copy[selected] > vote[bestAnecdote]) {
      setBestAnecdote(selected)
    }
  }


  return (
    <div>
      <h1> Anecdote of the day </h1>
      {anecdotes[selected]}
      <div>
        has {vote[selected]} votes
      </div>
        <Button handleClick={voteAnecdote} text='vote' />
        <Button handleClick={satunnaisNumero} text='next anecdote' />
        <BestAnecdote title='Anecdote with most votes' bestAnecdote={bestAnecdote} anecdotes={anecdotes} />
        has {vote[bestAnecdote]} votes
    </div>

  )
}


export default App

