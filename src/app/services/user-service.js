import axios from 'axios';

import * as event from '../utils/event';
import { USERS_URL, USER_INFO, USER_INFO_RESULT, NOTIFICATION } from '../utils/constants';

let initialized = false;

/**
 * This function is called from index.js. Here the listeners are attached for events.
 * This function should only be called once
 */
function init() {
  if(!initialized) {
    event.subscribe(USER_INFO,getUserInfo);

    initialized = true;
  }
}

function getUserInfo(action) {
  let url = `${USERS_URL}/${action.payload.username}`;
  axios.get(url)
  .then(resp => {
    event.dispatch({
      type: USER_INFO_RESULT,
      payload: resp
    })
  })
  .catch(handleError.bind(null,`getUserInfo() for ${action.payload.username}`));
}

function handleError(where, err) {
  console.log(where,err);

  event.dispatch({
    type: NOTIFICATION,
    payload: {
      message: `${err.message} -> ${err.response.data.message}`,
      isError: true
    }
  });
}

export default {
  init
};