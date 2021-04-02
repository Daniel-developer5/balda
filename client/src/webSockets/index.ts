import { io } from 'socket.io-client'
import { store } from '..'
import { setAlert, setGame } from '../redux/appSlice'
import { setTurn, setPlayers } from '../redux/gameSlice'
import { addOnlineUser, removeOnlineUser } from '../redux/onlineUsersSlice'
import { setStatictics } from '../redux/statisticsSlice'

export const socket = io('http://localhost:8080')

const initializeSocket = () => {
    socket.on('in-online', email => {
        store.dispatch(addOnlineUser(email))
    })

    socket.on('out-online', email => {
        store.dispatch(removeOnlineUser(email))
    })

    socket.on('invite', email => {
        store.dispatch(setAlert({ alert: true, type: 'invite', forInvite: email, }))
    })

    socket.on('invite-declined', email => {
        store.dispatch(setAlert({ alert: true, type: 'decline', forInvite: email, }))
    })

    socket.on('stop-invite', () => {
        store.dispatch(setAlert({ alert: false, type: 'error', }))
    })

    socket.on('accepted-invite', room => {
        socket.emit('join-room', room)
    })

    socket.on('start-game', ({ player1, player2, }) => {
        store.dispatch(setGame(true))
        store.dispatch(setPlayers([player1, player2]))
    })

    socket.on('set-turn', () => {
        store.dispatch(setTurn({ turn: false }))
    })

    socket.on('made-step', ({ word, lastStep, letter, }) => {
        store.dispatch(setStatictics({ word, player: 'opponent', }))
        store.dispatch(setTurn({ turn: true, lastStep, letter, }))
    })
}

export default initializeSocket