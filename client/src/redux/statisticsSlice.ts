import { createSlice } from '@reduxjs/toolkit'
import { socket } from '../webSockets'
import { checkWord } from './asyncReducers'

export interface IWord {
    word: string,
    isMy?: boolean,
}

export interface StatisticsSliceState {
    score: {
        my: number,
        opponent: number,
    },
    words: IWord[],
}

const initialState: StatisticsSliceState = {
    score: {
        my: 0,
        opponent: 0,
    },
    words: [],
}

interface SetScorePayload {
    payload: {
        player: 'my' | 'opponent',
        word: string,
    },
}

const statisticsSlice = createSlice({
    name: 'statistics',
    initialState,
    reducers: {
        setStatictics: (state, { payload }: SetScorePayload) => {
            state.score[payload.player] += payload.word.length
            state.words.push({
                word: payload.word,
                isMy: payload.player === 'my',
            })
        },
    },
    extraReducers: builder => {
        builder.addCase(checkWord.fulfilled, (state, { payload }) => {
            if (payload) {
                const { word, lastStep, letter, } = payload

                state.score.my += word.length
                state.words.push({
                    word: word,
                    isMy: true,
                })

                socket.emit('made-step', { word, lastStep, letter, })
            }
        })
    },
})

export const { setStatictics, } = statisticsSlice.actions

export default statisticsSlice