import axios from "axios";
import { Observable } from "rxjs";
import "rxjs/operator/switchMap";

import * as event from "../utils/event";
import {
  //SEARCH_USERS_URL,
  SEARCH_URL,
  SEARCH_USERS_RESULT,
  SET_USER_SEARCH_STREAM,
  USERS_RESULT
} from "../utils/constants";

let initialized = false;
let searchStream = null;

/**
 * This function is called from index.js. Here the listeners are attached for events.
 * This function should only be called once
 */
function init() {
  if (!initialized) {
    event.subscribe(SET_USER_SEARCH_STREAM, searchUsers);

    initialized = true;
  }
}

function searchUsers(action) {
  let stream = action.payload.searchStream;

  if (!stream || searchStream) {
    return;
  }

  searchStream = stream;

  let resultStream = searchStream.switchMap(params => {
    if(!params.query || params.query.length <=3) {
      return Observable.of({items:[]});
    }

    let url = `${SEARCH_URL}${params.option}?q=${params.query}+in:name,login`;
    let promise = axios.get(url);
    return Observable.fromPromise(promise)
          .map(resp => {
            resp.data.option = params.option;
            return resp.data;
          })
          .catch(handleError.bind(null,resultStream,"searchUsers"));
  });

  resultStream.subscribe(data => {
    event.dispatch({
      type: USERS_RESULT,
      payload: data
    });
  });
}

function handleError(retryStream,where, err) {
  console.log(`search-service.js -> ${where}()`, err);
  return retryStream;
}

export default {
  init
};
