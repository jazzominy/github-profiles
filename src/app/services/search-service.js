import axios from "axios";
import { Observable } from "rxjs";
import "rxjs/operator/switchMap";

import * as event from "../utils/event";
import {
  //SEARCH_USERS_URL,
  SEARCH_URL,
  SEARCH_USERS_RESULT,
  SET_USER_SEARCH_STREAM,
  USERS_RESULT,
  NAVIGATE_SEARCH_RESULTS
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
    event.subscribe(NAVIGATE_SEARCH_RESULTS, navigateSearchResults);

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

    let url = `${SEARCH_URL}${params.searchType}?q=${params.query}+in:name,login`;
    let promise = axios.get(url);
    return Observable.fromPromise(promise)
          .map(resp => {
            let links = parsePaginationLinks(resp.headers.link);
            resp.data.searchType = params.searchType;
            resp.data.links = links;
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

function navigateSearchResults(action) {
  let url = action.payload.url;

  axios.get(url)
        .then(resp => {
          let links = parsePaginationLinks(resp.headers.link);
          resp.data.searchType = action.payload.searchType;
          resp.data.links = links;
          event.dispatch({
            type: USERS_RESULT,
            payload: resp.data
          });
        })
        .catch(handleError.bind(null,'search-service -> navigateSearchResults()'));
}

function parsePaginationLinks(linkHeader) {
  let links = null;

  if(!linkHeader) {
    return links;
  }

  links = {};
  let result = linkHeader.split(",");
  result.forEach(item => {
    let parts = item.split("; ");
    if(parts.length) {
      let url = parts[0].trim();
      let rel = parts[1];
      url = url ? url.substr(1,url.length-2) : "";
      rel = rel ? rel.match(/rel="(\w+)"/)[1] : "";

      links[rel] = url;
    }
  });

  return links;
}

function handleError(retryStream,where, err) {
  console.log(`search-service.js -> ${where}()`, err);
  return retryStream;
}

export default {
  init
};
