import { fromJS } from 'immutable';

import * as constants from '../constants';
import createReducer from '../utils/createReducer';

const initialState = {
  loading: false,
  error: null,
  record: { },
  showNotification: false,
  activeTab: 'config'
};

export const config = createReducer(fromJS(initialState), { // eslint-disable-line import/prefer-default-export
  [constants.FETCH_CONFIGURATION_PENDING]: (state) =>
    state.merge({
      loading: true,
      record: { },
      showNotification: false
    }),
  [constants.FETCH_CONFIGURATION_REJECTED]: (state, action) =>
    state.merge({
      loading: false,
      error: `An error occured while loading the configuration: ${action.errorMessage}`
    }),
  [constants.FETCH_CONFIGURATION_FULFILLED]: (state, action) => {
    const { data } = action.payload;
    return state.merge({
      loading: false,
      record: fromJS(data),
      showNotification: data.showNotification
    });
  },
  [constants.CLOSE_NOTIFICATION_PENDING]: (state) =>
    state.merge({
      loading: true,
      showNotification: false
    }),
  [constants.CLOSE_NOTIFICATION_REJECTED]: (state) =>
    state.merge({
      loading: false
    }),
  [constants.CLOSE_NOTIFICATION_FULFILLED]: (state) =>
    state.merge({
      loading: false
    }),
  [constants.CONFIRM_NOTIFICATION_PENDING]: (state) =>
      state.merge({
        loading: true,
        showNotification: false
      }),
  [constants.CONFIRM_NOTIFICATION_REJECTED]: (state) =>
    state.merge({
      loading: false
    }),
  [constants.CONFIRM_NOTIFICATION_FULFILLED]: (state) =>
    state.merge({
      loading: false,
      showNotification: false,
      activeTab: 'rules'
    })
});
