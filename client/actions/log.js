import axios from 'axios';
import * as constants from '../constants';

/*
 * Load the logs history.
 */
export function fetchLogs(page = 1, errors) {
  const params = { page };
  if (errors) {
    params.filter = 'errors';
  }

  return {
    type: constants.FETCH_LOGS,
    payload: {
      promise: axios.get('/api/report', {
        params,
        timeout: 5000,
        responseType: 'json'
      })
    },
    meta: {
      page
    }
  };
}

/*
 * Open a log.
 */
export function openLog(log) {
  return {
    type: constants.OPEN_LOG,
    payload: {
      log
    }
  };
}

/*
 * Clear the current logs.
 */
export function clearLog() {
  return {
    type: constants.CLEAR_LOG
  };
}

/*
 * Set log filtering.
 */
export function setFilter(status) {
  return {
    type: constants.SET_FILTER,
    payload: {
      status
    }
  };
}
