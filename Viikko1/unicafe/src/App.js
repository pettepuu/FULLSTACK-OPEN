import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return(
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({text,value,symbol}) => {
  return (
    <tbody>
      <tr>
        <td>{text}</td>
        <td>{value}{symbol}</td>
      </tr>
    </tbody>

  )
}

const Statistics = ({props}) =>{
let positive = (props.good/props.total)*100
let avegrade = (props.good - props.bad) / props.total
Number((positive).toFixed(2))
Number((avegrade).toFixed(2))

  if (props.total === 0){
    return (
      <div>
        <h2>
          No feedback given
        </h2>
      </div>
    )
  }
  return(
    <div>
      <table>
      <StatisticLine text = "good" value ={props.good}/>
      <StatisticLine text = "neutral" value ={props.neutral}/>
      <StatisticLine text = "bad" value ={props.bad}/>
      <StatisticLine text = "avegrade" value ={avegrade}/>
      <StatisticLine text = "positive" value ={positive} symbol = "%"/>
      </table>
    </div>
  )
}

const App = () => {

  const [clicks, setClicks] = useState({
    good: 0, neutral: 0, bad: 0, total: 0
  })

  const handleGoodClick = () => {
    const newClicks = { 
      good: clicks.good + 1, 
      neutral: clicks.neutral,
      bad: clicks.bad, 
      total: clicks.total +1  
    }
    setClicks(newClicks)
  }

  const handleNeutralClick = () => {
    const newClicks = { 
      good: clicks.good, 
      neutral: clicks.neutral + 1,
      bad: clicks.bad, 
      total: clicks.total +1  
    }
    setClicks(newClicks)
  }
  const handleBadClick = () => {
    const newClicks = { 
      good: clicks.good, 
      neutral: clicks.neutral,
      bad: clicks.bad + 1, 
      total: clicks.total +1  
    }
    setClicks(newClicks)
  }

  return (
    <div>
      <div>
        <h1>Give Feedback</h1>
        <Button handleClick= {handleGoodClick} text="good" />
        <Button handleClick= {handleNeutralClick} text="neutral" />
        <Button handleClick= {handleBadClick} text="bad" />
        <h1>Statistics</h1>
        <Statistics props = {clicks}/> 

      </div>
    </div>
  )
}

export default App;
