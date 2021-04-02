import { FC, useCallback, useState } from 'react'

import { Button } from '@material-ui/core'
import { socket } from '../../../webSockets'
import { useSelector } from 'react-redux'
import { RootState } from '../../../interfaces'
import Loader from '../../Loader'

interface UserProps {
    email: string,
}

const User: FC<UserProps> = ({ email, }) => {
    const { email: receiver, } = useSelector((state: RootState) => state.home)
    const [ wait, setWait ] = useState<boolean>(false)

    socket.on('invite-declined', () => {
        setWait(false)
    })

    const invite = useCallback(() => {
        if (wait) {
            socket.emit('stop-invite', email)
            setWait(false)
            return
        }

        setWait(true)
        socket.emit('invite', { email, receiver, })
    }, [wait])

    return (
        <li>
            <div>
                <div className='avatar'>
                    <i className='fas fa-user'></i>
                </div>
                <span className='name'>{email}</span>
            </div>
            <Button
                variant='contained'
                color='primary'
                onClick={invite}
            >
                { !wait ?
                    <>
                        <i className='fas fa-user-plus'></i>
                        Invite in the game
                    </> :
                    <>
                        <i className='fas fa-times'></i>
                        Waiting
                        <div className='waiting-loader'>
                            <Loader width={20} height={20} type='ThreeDots' />
                        </div>
                    </>
                }
            </Button>
        </li>
    )
}

export default User