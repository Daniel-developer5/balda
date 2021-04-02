import { FC, useCallback } from 'react'

import { Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../interfaces'
import { Link } from 'react-router-dom'
import { setSignIn } from '../../redux/appSlice'
import { signOut as removeUserData } from '../../redux/homeSlice'
import { socket } from '../../webSockets'

import './ProfilePage.scss'

const ProfilePage: FC = () => {
    const dispatch = useDispatch()
    const { email, } = useSelector((state: RootState) => state.home)

    const signOut = useCallback(() => {
        socket.emit('leave-user', email)
        dispatch(setSignIn(false))
        dispatch(removeUserData())
    }, [])

    return (
        <div className='profile-page'>
            <div className='user-data'>
                {email}
            </div>
            <Link to='/'>Go Home</Link>
            <Button
                variant='contained'
                color='primary'
                onClick={signOut}
            >Sign Out</Button>
        </div>
    )
}

export default ProfilePage