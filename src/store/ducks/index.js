import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import { reducer as location } from './location'
import { reducer as darkMode } from './darkMode'
import { reducer as works } from './works'

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    location,
    darkMode,
    works,
  });
