import { FC, ReactNode } from 'react'

import Alert from '@material-ui/lab/Alert'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import { children } from '../../interfaces'

interface ErrorAlertProps {
    hideAlert: () => void,
    customText?: children,
}

const ErrorAlert: FC<ErrorAlertProps> = ({ hideAlert, customText, }) => {
    return (
        <Alert
            severity='error'
            action={
                <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={hideAlert}
                >
                    <CloseIcon fontSize='inherit' />
                </IconButton>
            }
        >
            { customText || <>
                <p>Ooops!</p>
                <p>There is some problem with it.</p>
                <p>Please, do according the instruction below:</p>
                <ol>
                    <li>Check your internet connection</li>
                    <li>Reload the page</li>
                </ol>
                <p>If it won't help, report us about the problem.</p>
            </>}
        </Alert>
    )
}

export default ErrorAlert