import { FC, useCallback, useEffect } from 'react'

import Statistic from './Statistic'
import Field from './Field'
import Letter from './Letter'
import { Button } from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../interfaces'
import { resetWord, setRepeatError } from '../../redux/gameSlice'
import { checkWord } from '../../redux/asyncReducers'
import { INITIAL_WORD } from '../../redux/gameSlice/utils'

import './Game.scss'
import { setAlert } from '../../redux/appSlice'

const getAlphabet = () => {
    const alphabet = []

    for (let i = 65; i <= 90; i++) {
        alphabet.push(String.fromCodePoint(i))
    }

    return alphabet
}

const Game: FC = () => {
    const dispatch = useDispatch()
    const { 
        lastStep, currentWord, activeButton, errorText, 
        squares, words, isGameEnd, score,
    } = useSelector((state: RootState) => ({ ...state.game, ...state.statistics, }))

    const reset = useCallback(() => dispatch(resetWord()), [])

    const check = useCallback(() => {
        const word = currentWord.toLowerCase()

        if (words.map(({ word: w, }) => w.toLowerCase()).indexOf(word) > -1 || word === INITIAL_WORD) {
            dispatch(setRepeatError())
            return
        }

        if (activeButton) {
            dispatch(checkWord({ 
                word: currentWord, 
                lastStep: lastStep || 0, 
                letter: squares[lastStep || 0].letter,
            }))
        }
    }, [activeButton, currentWord, lastStep, words])

    useEffect(() => {
        const win = score.my > score.opponent
        const draw = score.my === score.opponent

        if (isGameEnd) {
            dispatch(setAlert({ 
                alert: true, type: 'gameEnd', 
                gameEndText: `
                    ${win ? 'You win :)' : (draw ? 'Draw!' : 'You lose :(')}
                    You score: ${score.my}
                    You opponent score: ${score.opponent}
                    ${win ? 'Congratulations!' : 'You will do it in the next game!'}
                `
            }))
        }
    }, [isGameEnd, score])

    return (
        <div className='game'>
            <Statistic />
            <Field />
            <div className='check'>
                <span className={currentWord ? 'uppercase' : ''}>
                    { lastStep ? (currentWord || 'Show word') : (errorText || 'Add Letter')}
                    { currentWord && 
                        <button className='reset' onClick={reset}>
                            <i className='fas fa-times'></i>
                        </button> 
                    }
                </span>
                <Button
                    variant='contained'
                    color='primary'
                    className={activeButton ? '' : 'disabled'}
                    onClick={check}
                >Check</Button>
            </div>
            <ul className='letters'>
                {getAlphabet().map(letter => (
                    <Letter key={letter} letter={letter} />
                ))}
            </ul>
        </div>
    )
}

export default Game