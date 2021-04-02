import { FC } from 'react'

import { useSelector } from 'react-redux'
import { RootState } from '../../../interfaces'

import User from './User'

import './UserList.scss'

const UserList: FC = () => {
    const { onlineUsers, } = useSelector((state: RootState) => state.onlineUsers)

    return (
        <div className='user-list'>
            <h2>Users Online</h2>
            { !onlineUsers.length ? 
                <div className='empty'>There are no users online.</div> :
                <ul>
                    { onlineUsers.map(email => (
                        <User key={email} email={email} />
                    )) }
                </ul>
            }
        </div>
    )
}

export default UserList