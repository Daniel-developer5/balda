import { FC, useCallback, useEffect, useState } from 'react'

import { alertTypes, setAlert, setGame } from '../../redux/appSlice'
import { useDispatch, useSelector } from 'react-redux'
import ErrorAlert from './ErrorAlert'
import ConfirmAlert from './ConfirmAlert'
import { socket } from '../../webSockets'
import { RootState } from '../../interfaces'
import { killGame } from '../../redux/gameSlice'

import './Alert.scss'

interface AlertProps {
    type: alertTypes,
    email?: string,
    gameEndText?: string,
}

const AlertMessage: FC<AlertProps> = ({ type, email, gameEndText, }) => {
    const [active, setActive] = useState<boolean>(false)
    const dispatch = useDispatch()
    const { email: declinerEmail, forInvite, } = useSelector((state: RootState) => {
        return { ...state.home, ...state.app }
    })

    const hideAlert = useCallback(() => setActive(false), [])

    const closeAlert = useCallback(() => {
        if (!active) {
            dispatch(setAlert({ alert: false, }))
        }
    }, [active])

    const clickOutOfAlert = useCallback((e) => {
        if (type === 'invite' || type === 'gameEnd') {
            return
        }

        if (/alert-box-BALDA/.test((e.target as HTMLElement).className)) {
            hideAlert()
        }
    }, [])

    useEffect(() => setActive(true), [])

    const onAcceptInvite = useCallback(() => {
        socket.emit('accepted-invite', forInvite)
        hideAlert()
    }, [])

    const onDeclineInvite = useCallback(() => {
        socket.emit('decline-invite', declinerEmail)
        hideAlert()
    }, [])

    const onKillGame = useCallback(() => {
        dispatch(killGame())
        dispatch(setGame(false))
        hideAlert()
    }, [])

    const getContent = useCallback(() => {
        switch (type) {
            case 'error':
                return <ErrorAlert hideAlert={hideAlert} />
            case 'invite':
                return (
                    <ConfirmAlert 
                        hideAlert={hideAlert}
                        acceptFn={onAcceptInvite}
                        declineFn={onDeclineInvite}
                    >
                        <p>{email} are inviting you to play</p>
                    </ConfirmAlert>
                )
            case 'decline':
                return <ErrorAlert hideAlert={hideAlert} customText={
                    `${email} are busy. Try it later!`
                } />
            case 'gameEnd': 
                return (
                    <ConfirmAlert
                        hideAlert={hideAlert}
                        acceptFn={onKillGame}
                        accept='Ok'
                        noChoice
                    >
                        {gameEndText?.split(/\n/).map(str => <p key={str}>{str}</p>)}
                    </ConfirmAlert>
                )
        }
    }, [type])

    return (
        <div
            className={`alert-box alert-box-BALDA ${active ? 'active' : ''}`}
            onTransitionEnd={closeAlert}
            onClick={clickOutOfAlert}
        >
            <div className='alert'>
                {getContent()}
            </div>
        </div>
    )
}

export default AlertMessage