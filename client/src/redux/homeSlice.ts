import { createSlice } from '@reduxjs/toolkit'
import { getUserData, GetUserDataPayload } from './asyncReducers'

export interface HomeSliceState {
    email: string,
    loading: boolean,
    token: string,
}

const initialState: HomeSliceState = {
    email: '',
    loading: true,
    token: '',
}

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setLoading: (state, { payload }) => {
            state.loading = payload
        },
        signOut: state => {
            state.email = ''
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getUserData.fulfilled, (state, { payload }: GetUserDataPayload) => {
                state.loading = false
                state.email = payload.email
                state.token = payload.token
            })
    },
})

export const { setLoading, signOut, } = homeSlice.actions

export default homeSlice