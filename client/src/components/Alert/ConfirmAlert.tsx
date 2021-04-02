import { FC } from 'react'

import Alert from '@material-ui/lab/Alert'
import { Button } from '@material-ui/core'
import { children } from '../../interfaces'

interface InviteAlertProps {
    hideAlert: () => void,
    children: children,
    acceptFn: () => void,
    declineFn?: () => void,
    accept?: children,
    decline?: children,
    noChoice?: boolean,
}

const InviteAlert: FC<InviteAlertProps> = ({
    children, accept = 'Accept', decline = 'Decline',
    acceptFn, declineFn, noChoice,
}) => {
    return (
        <Alert severity='success'>
            {children}
            <div className='confirm-buttons'>
                <Button
                    onClick={acceptFn}
                    variant='contained'
                    color='primary'
                >{accept}</Button>
                {!noChoice &&
                    <Button
                        onClick={declineFn}
                        variant='contained'
                        color='secondary'
                    >{decline}</Button>
                }
            </div>
        </Alert>
    )
}

export default InviteAlert