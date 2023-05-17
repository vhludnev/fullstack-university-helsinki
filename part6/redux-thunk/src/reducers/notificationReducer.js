import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    updateNotification(state, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    },
  },
})

export const { updateNotification, removeNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch(updateNotification(content))
    setTimeout(() => dispatch(removeNotification()), time)
  }
}

export default notificationSlice.reducer
