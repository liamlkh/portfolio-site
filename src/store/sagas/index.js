import {
  all,
  takeLatest,
} from 'redux-saga/effects'

import { DarkModeTypes } from '../ducks/darkMode'
import { changeDarkMode, darkModeTransitionFinish } from './darkMode'

export default function* rootSaga() {
  yield all([
    takeLatest(DarkModeTypes.CHANGE_DARK_MODE, changeDarkMode),
    takeLatest(DarkModeTypes.DARK_MODE_TRANSITION_FINISH, darkModeTransitionFinish),
  ])
}
