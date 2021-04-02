import _ from 'lodash'
import { v4 as uuidv4 } from 'uuid'
import { ISquare } from './'

export const INITIAL_WORD = 'balda'

export const fillSquares = () => {
    return _.fill(Array(25), 0).map((i, index) => ({
        id: uuidv4(), active: false, 
        letter: (index >= 10 && index <= 14) ? INITIAL_WORD.split('')[index - 10] : '',
    }))
}

export const findNeighbour = (arr: ISquare[], index: number) => {
    return (arr[index + 1] && Boolean(arr[index + 1].letter)) || 
        (arr[index - 1] && Boolean(arr[index - 1].letter)) || 
        (arr[index + 5] && Boolean(arr[index + 5].letter)) || 
        (arr[index - 5] && Boolean(arr[index - 5].letter))
}

export const isNeighbourLastLetter = (index: number, last: number | null) => {
    if (!last) {
        return true
    }

    return index + 1 === last || 
        index - 1 === last ||
        index + 5 === last ||
        index - 5 === last ||
        index === last
}

export const getById = (arr: ISquare[], argId: string) => arr.findIndex(({ id }) => id === argId)