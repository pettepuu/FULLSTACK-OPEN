import React from 'react'
import { useDispatch } from 'react-redux'
import { setFilter } from '../reducers/filterSlice'

const Filter = () => {
  const dispatch = useDispatch()

  const handleChange = (event) => {
    const filteredContent = event.target.value
    dispatch(setFilter(filteredContent)) 
  }

  const style = {
    marginBottom: 10,
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter