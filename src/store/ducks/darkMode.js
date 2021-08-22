import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* Types & Action Creators */

const { Types, Creators } = createActions({
  changeDarkMode: [],
  darkModeTransitionStart: [],
  darkModeTransitionFinish: [],
})

export const DarkModeTypes = Types;
export default Creators;

/* Initial State */

export const INITIAL_STATE = Immutable({
  isOn: false,
  isChanging: false,
  isTransitioning: false,

})

/* Reducers */

const changeDarkMode = (state) => state.merge({
  ...state,
  isChanging: true,
})

const darkModeTransitionStart = (state) => state.merge({
  ...state,
  isTransitioning: true
})

const darkModeTransitionFinish = (state) => state.merge({
  isOn: !state.isOn,
  isChanging: false,
  isTransitioning: false
})

/* Reducers to types */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHANGE_DARK_MODE]: changeDarkMode,
  [Types.DARK_MODE_TRANSITION_START]: darkModeTransitionStart,
  [Types.DARK_MODE_TRANSITION_FINISH]: darkModeTransitionFinish,
})
