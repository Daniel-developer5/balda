import { FC, useCallback } from 'react'

import { useDispatch } from 'react-redux'
import { setLetter } from '../../redux/gameSlice'

interface LetterProps {
    letter: string,
}

const Letter: FC<LetterProps> = ({ letter, }) => {
    const dispatch = useDispatch()

    const onClick = useCallback(() => {
        dispatch(setLetter(letter))
    }, [])

    return (
        <li 
            onClick={onClick}
        >{letter}</li>
    )
}

export default Letter