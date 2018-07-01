import axios from "axios";
import { Observable } from "rxjs";
import "rxjs/operator/switchMap";

import * as event from "../utils/event";
import {
  SEARCH_URL,
  SEARCH_RESULT,
  SET_SEARCH_STREAM,
  NAVIGATE_SEARCH_RESULTS,
  NOTIFICATION
} from "../utils/constants";

let initialized = false;
let searchStream = null;

/**
 * This function is called from index.js. Here the listeners are attached for events.
 * This function should only be called once
 */
function init() {
  if (!initialized) {
    event.subscribe(SET_SEARCH_STREAM, setSearchStream);
    event.subscribe(NAVIGATE_SEARCH_RESULTS, navigateSearchResults);

    initialized = true;
  }
}

function setSearchStream(action) {
  let stream = action.payload.searchStream;

  if (!stream || searchStream) {
    return;
  }

  searchStream = stream;
  const CancelToken = axios.CancelToken;
  let cancel;

  let resultStream = searchStream.switchMap(params => {
    if (!params.query || params.query.length <= 3) {
      return Observable.of({ items: [] });
    }

    //Cancel the previous in-progress request
    if (cancel) cancel();

    let url = `${SEARCH_URL}${params.searchType}?q=${
      params.query
    }+in:name,description,login+sort:stars-desc`;
    let promise = axios.get(url, {
      cancelToken: new CancelToken(function(c) {
        cancel = c;
      })
    });

    event.showLoader(true);

    return Observable.fromPromise(promise)
      .map(resp => {
        let links = parsePaginationLinks(resp.headers.link);
        resp.data.searchType = params.searchType;
        resp.data.links = links;
        return resp.data;
      })
      .catch(handleError.bind(null, resultStream, "setSearchStream"));
  });

  resultStream.subscribe(data => {
    event.showLoader(false);
    event.dispatch({
      type: SEARCH_RESULT,
      payload: data
    });
  });
}

function navigateSearchResults(action) {
  let url = action.payload.url;

  axios
    .get(url)
    .then(resp => {
      let links = parsePaginationLinks(resp.headers.link);
      resp.data.searchType = action.payload.searchType;
      resp.data.links = links;
      event.dispatch({
        type: SEARCH_RESULT,
        payload: resp.data
      });
    })
    .catch(handleError.bind(null, "search-service -> navigateSearchResults()"));
}

/**
 * Parses the page navigation links from header
 * @param {*} linkHeader 
 */
function parsePaginationLinks(linkHeader) {
  let links = null;

  if (!linkHeader) {
    return links;
  }

  links = {};
  let result = linkHeader.split(",");
  result.forEach(item => {
    let parts = item.split("; ");
    if (parts.length) {
      let url = parts[0].trim();
      let rel = parts[1];
      url = url ? url.substr(1, url.length - 2) : "";
      rel = rel ? rel.match(/rel="(\w+)"/)[1] : "";

      if(rel == "next") {
        links.currentPage = parseInt(url.match(/page=(\d+)/)[1]) - 1;
      }
      else if(rel == "prev") {
        links.currentPage = parseInt(url.match(/page=(\d+)/)[1]) + 1;
      }

      links[rel] = url;
    }
  });

  return links;
}

function handleError(retryStream, where, err) {
  console.log(`search-service.js -> ${where}()`, err);
  event.showLoader(false);

  event.dispatch({
    type: NOTIFICATION,
    payload: {
      message: `${err.message} -> ${err.response.data.message}`,
      isError: true
    }
  })
  return retryStream;
}

export default {
  init
};
