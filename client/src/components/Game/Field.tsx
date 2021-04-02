import { FC } from 'react'

import { useSelector } from 'react-redux'
import { RootState } from '../../interfaces'
import Square from './Square'

const Field: FC = () => {
    const { squares, } = useSelector((state: RootState) => state.game)

    return (
        <ul className='field'>
            { squares.map(square => (
                <Square key={square.id} {...square} />
            ))}
        </ul>
    )
}

export default Field