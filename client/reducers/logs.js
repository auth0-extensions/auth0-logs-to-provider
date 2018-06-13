import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  records: [],
  total: 0,
  activeRecord: null
};

export const logs = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.OPEN_LOG]: (state, action) =>
    state.merge({
      activeRecord: action.payload.log
    }),
  [constants.CLEAR_LOG]: (state) =>
    state.merge({
      activeRecord: null
    }),
  [constants.FETCH_LOGS_PENDING]: (state) =>
    state.merge({
      loading: true,
      records: []
    }),
  [constants.FETCH_LOGS_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occurred while loading the logs: ${action.errorMessage}`
    }),
  [constants.FETCH_LOGS_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      records: fromJS(data.logs),
      nextPage: action.meta.page + 1,
      total: data.total
    });
  }
});
