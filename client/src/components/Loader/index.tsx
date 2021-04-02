import { FC } from 'react'

import ReactLoader from 'react-loader-spinner'

interface LoaderProps {
    width: number,
    height: number,
    type?: 'TailSpin' | 'ThreeDots',
}

const Loader: FC<LoaderProps> = ({ type, width, height, }) => {
    return (
        <ReactLoader
            color='#00BFFF'
            width={width}
            height={height}
            type={type || 'TailSpin'}
        />
    )
}

export default Loader