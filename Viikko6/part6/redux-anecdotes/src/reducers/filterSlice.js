import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => action.payload, // Updates filter string
  },
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer