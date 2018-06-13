import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  status: false
};

export const filter = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.SET_FILTER]: (state, action) => {
    return state.merge({
      status: action.payload.status
    });
  }
});
