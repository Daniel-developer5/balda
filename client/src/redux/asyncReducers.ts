import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE = 'http://localhost:8080'

interface SendDataParams { 
    email: string, password: string, signUp?: boolean,
}

export const sendData = createAsyncThunk(
    'sendDataStatus',
    async ({ email, password, signUp, }: SendDataParams) => {
        const res = await axios.post(`${API_BASE}/login-form`, { email, password, signUp, })

        if (res.data.error) {
            if (res.data.definedError) {
                return res.data
            }

            throw new Error('DBError')
        }

        return res.data
    }
)

export interface SendDataPayload {
    payload: {
        error?: boolean,
        notAvailableEmail?: boolean,
        incorrectPassword?: boolean,
        notRegisteredEmail?: boolean,
        token?: string,
    }
}

export const getUserData = createAsyncThunk(
    'getUserDataStatus',
    async (id: string) => {
        const res = await axios.get(`${API_BASE}/get-user/${id}`)

        if (res.data.error) {
            throw new Error('DBError')
        }

        return res.data
    }
)

export interface GetUserDataPayload {
    payload: {
        email: string,
        token: string,
    }
}

interface CheckWordParams {
    word: string, lastStep: number, letter: string,
}

export const checkWord = createAsyncThunk(
    'checkWordStatus',
    async ({ word, lastStep, letter, }: CheckWordParams) => {
        const formattedWord = word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase()

        const res = await axios.get(
            `https://en.wikipedia.org/w/api.php?&origin=*&action=opensearch&search=${formattedWord}`
        )
        
        return res.data[1][0] === formattedWord ? {
            word: res.data[0],
            lastStep,
            letter
        } : false
    }
)