import { createSlice } from '@reduxjs/toolkit'

export interface OnlineUsersSliceState {
    onlineUsers: string[],
}

const initialState: OnlineUsersSliceState = {
    onlineUsers: [],
}

interface AddUserPayload {
    payload: string | string[],
}

const onlineUsersSlice = createSlice({
    name: 'onlineUsers',
    initialState,
    reducers: {
        addOnlineUser: (state, { payload }: AddUserPayload) => {
            if (payload instanceof Array) {
                state.onlineUsers = [...payload]
            } else {
                state.onlineUsers.push(payload)
            }
        },
        removeOnlineUser: (state, { payload }) => {
            state.onlineUsers.splice(state.onlineUsers.findIndex(email => email === payload), 1)
        },
    },
})

export const { addOnlineUser, removeOnlineUser, } = onlineUsersSlice.actions

export default onlineUsersSlice