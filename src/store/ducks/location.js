import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* Types & Action Creators */

const { Types, Creators } = createActions({
  initLocation: ['location'],
  setLocationRequest: ['location'],
  setLocation: [],
})

export const LocationTypes = Types;
export default Creators;

/* Initial State */

export const INITIAL_STATE = Immutable({
  current: null,
  target: null,
  isChanging: false,
})

/* Reducers */

const initLocation = (state, { location }) => state.merge({
  ...state,
  current: location
})

const setLocationRequest = (state, { location }) => state.merge({
  ...state,
  target: location,
  isChanging: true,
})

const setLocation = (state) => state.merge({
  ...state,
  current: state.target,
  target: null,
  isChanging: false,
})

/* Reducers to types */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.INIT_LOCATION]: initLocation,
  [Types.SET_LOCATION_REQUEST]: setLocationRequest,
  [Types.SET_LOCATION]: setLocation,
})
