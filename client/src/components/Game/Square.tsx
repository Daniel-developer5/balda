import { FC, useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../interfaces'
import { setActive } from '../../redux/gameSlice'

interface SquareProps {
    readonly id: string,
    active: boolean,
    letter: string,
}

const Square: FC<SquareProps> = ({ id, active, letter, }) => {
    const dispatch = useDispatch()
    const { myTurn, } = useSelector((state: RootState) => state.game)

    const toggleActive = useCallback(() => dispatch(setActive(id)), [])

    return (
        <li
            onClick={toggleActive}
            className={`${active ? 'active' : ''} ${myTurn ? '' : 'not-hover'}`}
        >{letter}</li>
    )
}

export default Square