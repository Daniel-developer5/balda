import { FC, useEffect } from 'react'

import Form from './components/Form'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Alert from './components/Alert'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './interfaces'
import HomePage from './components/HomePage'
import { setSignIn } from './redux/appSlice'
import ProfilePage from './components/ProfilePage'
import { socket } from './webSockets'
import Game from './components/Game'

import './App.scss'

const App: FC = () => {
  const dispatch = useDispatch()
  const {
    alert, alertType, isSignIn,
    forInvite, email, game, gameEndText,
  } = useSelector((state: RootState) => (
    { ...state.app, ...state.home,}
  ))

  useEffect(() => {
    if (window.localStorage.getItem('token')) {
      dispatch(setSignIn(true))
    }
  }, [])

  useEffect(() => {
    if (email) {
      socket.emit('go-online', email)
    }
  }, [email])

  return (
    <BrowserRouter>
      <div className='wrapper'>
        {alert && 
          <Alert type={alertType} email={forInvite} gameEndText={gameEndText} />
        }
        <Switch>
          <Route path='/' exact>
            {!isSignIn ?
              <Redirect to='/sign-in' /> :
              (!game ? <HomePage /> : <Game />)
            }
          </Route>
          <Route path='/sign-in'>
            {isSignIn ? <Redirect to='/' exact /> : <Form />}
          </Route>
          <Route path='/sign-up'>
            {isSignIn ? <Redirect to='/' exact /> : <Form signUp />}
          </Route>
          <Route path='/profile'>
            {!isSignIn ?
              <Redirect to='/sign-in' /> :
              (!game ? <ProfilePage /> : <Game />)
            }
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  )
}

export default App
