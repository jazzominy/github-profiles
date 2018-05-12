import axios from 'axios';

import * as event from '../utils/event';
import { USERS, USERS_URL, USERS_RESULT } from '../utils/constants';

let initialized = false;

/**
 * This function is called from index.js. Here the listeners are attached for events.
 * This function should only be called once
 */
function init() {
  if(!initialized) {
    event.subscribe(USERS,getUsers);

    initialized = true;
  }
}

function getUsers() {
  let randomOffset = Math.floor(Math.random()*500);
  return axios.get(USERS_URL + `?since=${randomOffset}`)
         .then(resp => {
           event.dispatch({
             type: USERS_RESULT,
             payload: resp.data
           });
         })
         .catch(handleError.bind(null,'user-service -> getUsers()'));
}

function handleError(where, err) {
  console.log(where,err);
}

export default {
  init
};