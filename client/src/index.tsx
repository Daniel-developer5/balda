import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import formSlice from './redux/formSlice'
import { Provider } from 'react-redux'
import appSlice from './redux/appSlice'
import homeSlice from './redux/homeSlice'
import initializeSocket from './webSockets'
import onlineUsersSlice from './redux/onlineUsersSlice'
import gameSlice from './redux/gameSlice'
import statisticsSlice from './redux/statisticsSlice'

export const store = configureStore({
  reducer: combineReducers({
    form: formSlice.reducer,
    app: appSlice.reducer,
    home: homeSlice.reducer,
    onlineUsers: onlineUsersSlice.reducer,
    game: gameSlice.reducer,
    statistics: statisticsSlice.reducer,
  }),
})

initializeSocket()

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
