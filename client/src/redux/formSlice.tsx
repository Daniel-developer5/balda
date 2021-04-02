import { createSlice } from '@reduxjs/toolkit'
import { sendData, SendDataPayload } from './asyncReducers'

const errTexts = {
    email: [
        'Email is not valid', 'This email has already taken. Please use another one.',
        'There is not user with this email',
    ],
    password: [
        'Password must contains lower case letter and number. Password length must be at least 8 characters', 
        'Password is incorrect',
    ],
}

export interface FormSliceState {
    email: string,
    password: string,
    showPassword: boolean,
    emailErr: boolean,
    passwordErr: boolean,
    emailErrText: string,
    passwordErrText: string,
    loading: boolean,
}

const initialState: FormSliceState = {
    email: '',
    password: '',
    showPassword: false,
    emailErr: false,
    passwordErr: false,
    emailErrText: errTexts.email[0],
    passwordErrText: errTexts.password[0],
    loading: false,
}

interface ChangeFieldPayload {
    payload: {
        field: 'email' | 'password',
        value: string,
    },
}

interface SetErrorPayload {
    payload: {
        field: 'emailErr' | 'passwordErr',
        err: boolean,
    },
}

const setEmailError = (state: FormSliceState, variant: 0 | 1 | 2) => {
    state.emailErr = true
    state.emailErrText = errTexts.email[variant]
}

const formSlice = createSlice({
    name: 'form',
    initialState,
    reducers: {
        changeField: (state, { payload }: ChangeFieldPayload) => {
            state[payload.field] = payload.value
        },
        showPass: state => {
            state.showPassword = !state.showPassword
        },
        setError: (state, { payload }: SetErrorPayload) => {
            state[payload.field] = payload.err

            state.emailErrText = errTexts.email[0]
            state.passwordErrText = errTexts.password[0]
        },
        setLoading: (state, { payload }) => {
            state.loading = payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(sendData.fulfilled, (state, { payload }: SendDataPayload) => {
                state.loading = false
                
                if (payload.error) {
                    if (payload.notAvailableEmail) {
                        setEmailError(state, 1)
                    }

                    if (payload.notRegisteredEmail) {
                        setEmailError(state, 2)
                    }

                    if (payload.incorrectPassword) {
                        state.passwordErr = true
                        state.passwordErrText = errTexts.password[1]
                        setEmailError(state, 0)
                    }

                    return
                }
                
                state.email = ''
                state.password = ''
                state.emailErr = false
                state.passwordErr = false
                state.showPassword = false
            })
    },
})

export const { changeField, showPass, setError, setLoading, } = formSlice.actions

export default formSlice