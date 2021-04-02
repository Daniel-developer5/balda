import { ChangeEvent, FC, useCallback } from 'react'

import { Button, TextField, Checkbox, FormControlLabel } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../interfaces'
import { changeField, showPass, setError, setLoading, } from '../../redux/formSlice'
import { Link } from 'react-router-dom'
import validator from './validator'
import { sendData } from '../../redux/asyncReducers'
import Loader from '../Loader'

import './Form.scss'

interface FormProps {
    signUp?: boolean,
}

const Form: FC<FormProps> = ({ signUp, }) => {
    const dispatch = useDispatch()
    const { 
        email, password, showPassword,
        emailErr, passwordErr, 
        emailErrText, passwordErrText, loading,
    } = useSelector((state: RootState) => state.form)

    const onChangeEmail = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeField({ field: 'email', value: e.target.value, }))
    }, [email])

    const onChangePass = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeField({ field: 'password', value: e.target.value, }))
    }, [password])

    const onChangeShowPass = useCallback(() => dispatch(showPass()), [showPassword])

    const checker = useCallback((condition: boolean, field: 'emailErr' | 'passwordErr') => {
        if (condition) {
            dispatch(setError({ field, err: false, }))
        } else {
            dispatch(setError({ field, err: true, }))
        }
    }, [])

    const submitForm = useCallback(e => {
        e.preventDefault()

        if (!signUp) {
            dispatch(setLoading(true))
            dispatch(sendData({ email, password, signUp, }))

            return
        }

        const [validEmail, validPassword] = validator(email, password)

        if (validEmail && validPassword) {
            checker(validEmail, 'emailErr')
            checker(validPassword, 'passwordErr')

            dispatch(setLoading(true))
            dispatch(sendData({ email, password, signUp, }))
        } else {
            checker(validEmail, 'emailErr')
            checker(validPassword, 'passwordErr')
        }
    }, [email, password, signUp])

    return (
        <form className='login-form' onSubmit={submitForm}>
            <div className='field-box'>
                <TextField
                    onChange={onChangeEmail}
                    label='Email'
                    variant='outlined'
                    value={email}
                    error={emailErr}
                    helperText={emailErr ? emailErrText : ''}
                ></TextField>
                <TextField
                    onChange={onChangePass}
                    label='Password'
                    variant='outlined'
                    value={password}
                    type={showPassword ? 'text' : 'password'}
                    error={passwordErr}
                    helperText={passwordErr ? passwordErrText : ''}
                ></TextField>
            </div>
            <div className='checkbox'>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={onChangeShowPass}
                            color='primary'
                            checked={showPassword}
                        />
                    }
                    label='Show Password'
                />
            </div>
            <Button
                variant='contained'
                color='primary'
                type={loading ? 'button' : 'submit'}
                className={(loading || !email || !password) ? 'disabled' : ''}
            >
                { loading ?
                    <Loader width={50} height={50} /> :
                    signUp ? 'Sign Up' : 'Sign In'
                }
            </Button>
            <div className='question'>
                { signUp ? 'Have you an account?' : 'Don\'t have an account?' }
                <Link to={signUp ? '/sign-in' : '/sign-up'}>
                    { signUp ? 'Log In' : 'Create It' }
                </Link>
            </div>
        </form>
    )
}

export default Form