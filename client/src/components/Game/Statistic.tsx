import { FC, useCallback } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../interfaces'
import { setDrop } from '../../redux/gameSlice'
import { IWord } from '../../redux/statisticsSlice'

interface StatisticsListProps {
    words: IWord[],
    my?: boolean,
    right?: boolean,
}

const StatisticsList: FC<StatisticsListProps> = ({ words, my, right, }) => (
    <div>
        <ul>
            {words.filter(({ isMy, }) => my ? isMy : !isMy).map(({ word, }) => (
                <li key={word}>
                    <span className={right ? 'right' : ''}>{word}: {word.length}</span>
                </li>
            ))}
        </ul>
    </div>
)

const Statistic: FC = () => {
    const dispatch = useDispatch()
    const { dropStatistic, score, words, players, email, } = useSelector((state: RootState) => (
        { ...state.game, ...state.statistics, ...state.home, }
    ))
    const opponent = players[0] === email ? players[1] : players[0]

    const dropDownStatistic = useCallback(() => dispatch(setDrop()), [])

    return (
        <div className='statistic'>
            <div>
                <span>You: {score.my}</span>
                <span className='line'>|</span>
                <span>{opponent}: {score.opponent}</span>
                <button onClick={dropDownStatistic}>
                    <i className={
                        `fas fa-arrow-up ${dropStatistic ? 'rotate' : ''}`
                    }></i>
                </button>
            </div>
            <div className={`statistics ${dropStatistic ? 'active' : ''}`}>
                <StatisticsList words={words} my />
                <StatisticsList words={words} right />
            </div>
        </div>
    )
}

export default Statistic