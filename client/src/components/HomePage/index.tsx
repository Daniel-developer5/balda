import { FC, useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Link,} from 'react-router-dom'
import { RootState } from '../../interfaces'
import { getUserData } from '../../redux/asyncReducers'
import { setLoading } from '../../redux/homeSlice'
import Loader from '../Loader'
import UserList from './UserList'

import './HomePage.scss'

const HomePage: FC = () => {
    const dispatch = useDispatch()
    const { loading, email, token, } = useSelector((state: RootState) => state.home)

    useEffect(() => {
        dispatch(setLoading(true))
        dispatch(getUserData(token || window.localStorage.getItem('token') || ''))
    }, [])
    
    return (
        <div className={`home-page ${!loading ? 'not-center' : ''}`}>
            { loading ?
                <Loader width={100} height={100} /> :
                <>
                    <div className='link-box'>
                        <Link to='/profile'>{email}</Link>
                    </div>
                    <UserList />
                </>
            }
        </div>
    )
}

export default HomePage