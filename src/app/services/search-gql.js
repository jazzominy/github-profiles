import axios from "axios";

import * as event from "../utils/event";
import {
  GITHUB_GQL_ENDPOINT,
  SEARCH,
  SEARCH_RESULT,
  NOTIFICATION
} from "../utils/constants";

let initialized = false;

/**
 * This function is called from index.js. Here the listeners are attached for events.
 * This function should only be called once
 */
function init() {
  if (!initialized) {
    event.subscribe(SEARCH, onSearch);
    //event.subscribe(NAVIGATE_SEARCH_RESULTS, navigateSearchResults);

    initialized = true;
  }
}

function onSearch(action) {
  event.showLoader(true);

  axios.post(GITHUB_GQL_ENDPOINT,{
    query: `query {
      search(query:"${action.payload.query}",first:30,type:${action.payload.searchType}) {
        userCount,
        pageInfo {
          hasNextPage,
          hasPreviousPage
        },
        edges {
          cursor,
          node {
            __typename
            ... on User {
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
            }
            __typename
            ... on Repository {
              name,
              url,
              description,
              forkCount,
              stargazers {
                totalCount
              },
              owner {
                avatarUrl
              }
            }
          }
        }
      }
    }`
  }, {
    headers: {
      "Authorization": "Bearer 38f6c1e256532edafb71cdfd7be014b2c2eab6a2"
    }
  }).then(resp => {
    event.showLoader(false);
    event.dispatch({
      type: SEARCH_RESULT,
      payload: {
        items: resp.data.data.search.edges,
        searchType: action.payload.searchType,
        total_count: resp.data.data.search.userCount,
        links: []
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