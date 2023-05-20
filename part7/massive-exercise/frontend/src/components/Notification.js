import { Alert } from '@mui/material'
import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()

  if (!notification) return null

  return (
    <Alert
      sy={{
        mb: '1rem',
      }}
      severity='success'
    >
      {notification}
    </Alert>
  )
}

export default Notification
