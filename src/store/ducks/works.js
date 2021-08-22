import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* Types & Action Creators */

const { Types, Creators } = createActions({
  initWorks: ['data'],
  browseWork: ['direction'],
  browseWorkTransitionFinish: []
})

export const WorksTypes = Types;
export default Creators;

/* Initial State */

export const INITIAL_STATE = Immutable({
  currentIndex: null,
  data: [],
  direction: null,
})

/* Reducers */

const initWorks = (state, { data }) => state.merge({
  currentIndex: data.length > 0 ? 0 : null,
  data: data,
})

const browseWork = (state, { direction }) => state.merge({
  ...state,
  currentIndex: (state.data.length + state.currentIndex + direction) % state.data.length,
  direction: direction
})

const browseWorkTransitionFinish = (state) => state.merge({
  ...state,
  direction: null
})

/* Reducers to types */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT_WORKS]: initWorks,
  [Types.BROWSE_WORK]: browseWork,
  [Types.BROWSE_WORK_TRANSITION_FINISH]: browseWorkTransitionFinish,
})
