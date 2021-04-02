import { createSlice } from '@reduxjs/toolkit'
import { checkWord } from '../asyncReducers'
import { 
    isNeighbourLastLetter, fillSquares, 
    findNeighbour, getById
} from './utils'

export interface ISquare {
    readonly id: string,
    active: boolean,
    letter: string,
}

export interface GameSliceState {
    dropStatistic: boolean,
    squares: ISquare[],
    myTurn: boolean,
    players: [string, string] | [],
    isGameEnd: boolean,
    lastStep: number | null,
    currentWord: string,
    itemWithLastLetter: number | null,
    selectedItems: number[],
    activeButton: boolean,
    currentActive?: number | null,
    errorText?: string,
}

const initialState: GameSliceState = {
    dropStatistic: false,
    squares: fillSquares(),
    myTurn: true,
    players: [],
    isGameEnd: false,
    lastStep: null,
    currentWord: '',
    itemWithLastLetter: null,
    selectedItems: [],
    activeButton: false,
}

const reset = (state: GameSliceState) => {
    state.currentWord = ''
    state.selectedItems.forEach(i => state.squares[i].active = false)
    state.itemWithLastLetter = null
    state.selectedItems = []
    state.activeButton = false
    state.currentActive = null
}

const checkGameEnd = (state: GameSliceState) => {
    if (state.squares.every(({ letter }) => letter)) {
        state.isGameEnd = true
    }
}

const removeLastLetter = (state: GameSliceState) => {
    if (state.lastStep || state.lastStep === 0) {
        state.squares[state.lastStep].letter = ''
        state.lastStep = null
    }
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setDrop: state => {
            state.dropStatistic = !state.dropStatistic
        },
        setActive: (state, { payload }) => {
            if (!state.myTurn) {
                if (!state.errorText) {
                    state.errorText = 'It is not your turn'
                }

                return
            }

            if (state.errorText) {
                state.errorText = ''
            }

            const index = getById(state.squares, payload)

            if (!findNeighbour(state.squares, index) || !state.myTurn) {
                return
            }

            if (state.lastStep || state.lastStep === 0) {
                if (
                    state.squares[index].letter && 
                    isNeighbourLastLetter(index, state.itemWithLastLetter)
                ) {
                    state.squares[index].active = !state.squares[index].active
                    
                    if (state.squares[index].active) {
                        state.currentWord += state.squares[index].letter
                        state.itemWithLastLetter = index
                        state.selectedItems.push(index)
                    } else {
                        const { length } = state.selectedItems
                        state.currentWord = state.currentWord.slice(0, -1)
                        state.itemWithLastLetter = length > 1 ? state.selectedItems[length - 1] : null
                        state.selectedItems.pop()
                    }

                    if (index === state.lastStep) {
                        state.currentActive = index
                    }

                    if (
                        state.selectedItems.length >= 2 && 
                        state.selectedItems.indexOf(state.lastStep) > -1 &&
                        state.currentWord
                    ) {
                        state.activeButton = true
                    } else {
                        state.activeButton = false
                    }

                    return
                } 

                if (state.currentWord) {
                    return
                }
            }

            if (state.squares[index].letter && index !== state.lastStep) {
                return
            }

            state.squares[index].active = !state.squares[index].active
            
            if (state.currentActive || state.currentActive === 0) {
                if (state.currentActive !== index) {
                    state.squares[state.currentActive].active = false
                }

                if (!state.squares[state.currentActive].active && state.currentActive === index) {
                    state.currentActive = null
                    return
                }

                state.currentActive = index
            } else {
                state.currentActive = index
            }
        },
        resetWord: state => {
            reset(state)
        },
        setLetter: (state, { payload }) => {
            if (state.currentActive || state.currentActive === 0) {
                state.squares[state.currentActive].letter = payload
                state.squares[state.currentActive].active = false
                
                if (!state.lastStep) {
                    state.lastStep = state.currentActive
                }

                if (state.lastStep !== state.currentActive) {
                    state.squares[state.lastStep].letter = ''
                }

                if (state.currentWord) {
                    state.currentWord = ''
                }

                state.lastStep = state.currentActive
                state.currentActive = null
            }
        },
        setTurn: (state, { payload }) => {
            state.myTurn = payload.turn

            if (payload.letter) {
                state.squares[payload.lastStep].letter = payload.letter
            }

            checkGameEnd(state)
        },
        setRepeatError: state => {
            state.errorText = 'This word had already been'
            
            removeLastLetter(state)
            reset(state)
        },
        setPlayers: (state, { payload }) => {
            state.players = payload
        },
        killGame: state => {
            reset(state)
            state.squares = fillSquares()
            state.selectedItems = []
            state.players = []
            state.isGameEnd = false
        },
    },
    extraReducers: builder => {
        builder.addCase(checkWord.fulfilled, (state, { payload }) => {
            if (!payload) {
                reset(state)
                removeLastLetter(state)

                state.errorText = 'There is no such word'
            } else {
                reset(state)
                state.myTurn = false
                state.lastStep = null

                checkGameEnd(state)
            }
        })
    },
})

export const { 
    setDrop, setActive, setLetter, 
    setTurn, resetWord, setRepeatError, 
    setPlayers, killGame,
} = gameSlice.actions

export default gameSlice