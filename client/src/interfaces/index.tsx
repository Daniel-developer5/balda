import { FormSliceState } from '../redux/formSlice'
import { AppSliceState } from '../redux/appSlice'
import { HomeSliceState } from '../redux/homeSlice'
import { OnlineUsersSliceState } from '../redux/onlineUsersSlice'
import { GameSliceState } from '../redux/gameSlice'
import { StatisticsSliceState } from '../redux/statisticsSlice'
import { ReactNode } from 'react'

export interface RootState {
    form: FormSliceState,
    app: AppSliceState,
    home: HomeSliceState,
    onlineUsers: OnlineUsersSliceState,
    game: GameSliceState,
    statistics: StatisticsSliceState,
}

export type children = string | ReactNode | ReactNode[]