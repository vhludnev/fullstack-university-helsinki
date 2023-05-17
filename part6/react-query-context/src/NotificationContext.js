import { createContext, useContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
  return action.payload
}

const NotificationContext = createContext()

export const useNotificationValue = () => {
  const notificationAndUpdate = useContext(NotificationContext)
  return notificationAndUpdate[0]
}

export const useUpdateNotification = () => {
  const notificationAndUpdate = useContext(NotificationContext)
  return notificationAndUpdate[1]
}

export const NotificationContextProvider = props => {
  const [notification, updateNotification] = useReducer(notificationReducer, { message: '', error: '' })

  if (notification) {
    setTimeout(() => updateNotification({ payload: null }), 5000)
  }

  return (
    <NotificationContext.Provider value={[notification, updateNotification]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export default NotificationContext
