import axios from "axios";

import * as event from "../utils/event";
import {
  GITHUB_GQL_ENDPOINT,
  SEARCH,
  SEARCH_RESULT,
  NOTIFICATION,
  NAVIGATE_SEARCH_RESULTS
} from "../utils/constants";

let initialized = false;
let pageInfo = null;
let query = "";
let userFragment = `fragment userFields on User {
  id,
  login,
  name,
  avatarUrl,
  bio,
  location,
  url,
  repositories {
    totalCount
  }
  followers {
    totalCount
  },
  following {
    totalCount
  },
  organizations(first:10) {
    edges {
      node {
        name
      }
    }
  }
}`;
let repoFragment = `fragment repoFields on Repository {
  name,
  url,
  description,
  forkCount,
  stargazers {
    totalCount
  },
  owner {
    avatarUrl,
    login,
    url
  }
}`;

/**
 * This function is called from index.js. Here the listeners are attached for events.
 * This function should only be called once
 */
function init() {
  if (!initialized) {
    event.subscribe(SEARCH, onSearch);
    event.subscribe(NAVIGATE_SEARCH_RESULTS, navigateSearchResults);

    initialized = true;
  }
}

function onSearch(action) {
  event.showLoader(true);

  query = action.payload.query;

  axios.post(GITHUB_GQL_ENDPOINT,{
    query: `query {
      search(query:"${action.payload.query}",first:30,type:${action.payload.searchType}) {
        userCount,
        pageInfo {
          startCursor,
          hasNextPage,
          hasPreviousPage,
          endCursor
        },
        edges {
          cursor,
          node {
            __typename
            ...userFields
            __typename
            ...repoFields
          }
        }
      }
    }
    ${userFragment}
    ${repoFragment}`
  }, {
    headers: {
      "Authorization": "Bearer token"
    }
  }).then(resp => {
    event.showLoader(false);
    pageInfo = resp.data.data.search.pageInfo;
    event.dispatch({
      type: SEARCH_RESULT,
      payload: {
        items: resp.data.data.search.edges,
        searchType: action.payload.searchType,
        total_count: resp.data.data.search.userCount,
        links: [],
        pageInfo: resp.data.data.search.pageInfo
      }
    })
  })
  .catch(handleError.bind(null,"onSearch"));
}

function navigateSearchResults(action) {
  let direction = action.payload.direction == "prev" ? `,before:"${pageInfo.startCursor}"` : `,after:"${pageInfo.endCursor}"`
  let firstOrLast = action.payload.direction == "prev" ? "last" : "first";
  axios.post(GITHUB_GQL_ENDPOINT,{
    query: `query {
      search(query:"${query}",${firstOrLast}:30,type:${action.payload.searchType}${direction}) {
        userCount,
        pageInfo {
          startCursor,
          hasNextPage,
          hasPreviousPage,
          endCursor
        },
        edges {
          cursor,
          node {
            __typename
            ...userFields
            __typename
            ...repoFields
          }
        }
      }
    }
    ${userFragment}
    ${repoFragment}`
  }, {
    headers: {
      "Authorization": "Bearer token"
    }
  }).then(resp => {
    event.showLoader(false);
    pageInfo = resp.data.data.search.pageInfo;
    event.dispatch({
      type: SEARCH_RESULT,
      payload: {
        items: resp.data.data.search.edges,
        searchType: action.payload.searchType,
        total_count: resp.data.data.search.userCount,
        links: [],
        pageInfo: resp.data.data.search.pageInfo
      }
    })
  })
  .catch(handleError.bind(null,"onSearch"));
}

function handleError(where, err) {
  console.log(`search-gql.js -> ${where}()`, err);
  event.showLoader(false);

  event.dispatch({
    type: NOTIFICATION,
    payload: {
      message: `${err.message} -> ${err.response.data.message}`,
      isError: true
    }
  })
}

export default {
  init
};