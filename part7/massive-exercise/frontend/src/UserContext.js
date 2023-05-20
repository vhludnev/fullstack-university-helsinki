import { createContext, useReducer, useContext, useEffect } from 'react'

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = props => {
  const [user, dispatch] = useReducer(reducer, null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      dispatch({ type: 'SET', payload: user })
    }
  }, [])

  return <UserContext.Provider value={[user, dispatch]}>{props.children}</UserContext.Provider>
}

export const useUserData = () => {
  const [user] = useContext(UserContext)
  return user
}

export const useSetUser = () => {
  const valueAndDispatch = useContext(UserContext)
  const dispatch = valueAndDispatch[1]

  return payload => {
    dispatch({ type: 'SET', payload })
  }
}

export const useRemoveUser = () => {
  const valueAndDispatch = useContext(UserContext)
  const dispatch = valueAndDispatch[1]

  return () => {
    dispatch({ type: 'CLEAR' })
  }
}

export default UserContext
