import { createSlice } from '@reduxjs/toolkit'
import { checkWord, getUserData, sendData, SendDataPayload } from './asyncReducers'

export type alertTypes = 'error' | 'invite' | 'decline' | 'gameEnd'

export interface AppSliceState {
    alert: boolean,
    alertType: alertTypes,
    isSignIn: boolean,
    game: boolean,
    forInvite?: string,
    gameEndText?: string,
}

const initialState: AppSliceState = {
    alert: false,
    alertType: 'error',
    isSignIn: false,
    game: false,
}

interface SetAlertPayload {
    payload: {
        alert: boolean,
        type?: alertTypes,
        forInvite?: string,
        gameEndText?: string,
    },
}

const onError = (state: AppSliceState) => {
    state.alert = true
    state.alertType = 'error'
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAlert: (state, { payload }: SetAlertPayload) => {
            state.alert = payload.alert

            if (payload.type) {
                state.alertType = payload.type
            }

            if (payload.forInvite) {
                state.forInvite = payload.forInvite
            }

            if (payload.gameEndText) {
                state.gameEndText = payload.gameEndText
            }
        },
        setSignIn: (state, { payload }) => {
            if (!payload) {
                delete window.localStorage.token
            }

            state.isSignIn = payload
        },
        setGame: (state, { payload }) => {
            state.game = payload
        },
    },
    extraReducers: builder => {
        builder
            .addCase(sendData.rejected, state => {
                onError(state)
            }).addCase(sendData.fulfilled, (state, { payload }: SendDataPayload) => {
                if (payload.error) {
                    return
                }
                
                if (payload.token) {
                    window.localStorage.setItem('token', payload.token)
                    state.isSignIn = true
                }
            }).addCase(getUserData.rejected, state => {
                onError(state)
            }).addCase(checkWord.rejected, state => {
                onError(state)
            })
    },
})

export const { setAlert, setSignIn, setGame, } = appSlice.actions

export default appSlice