import React, { useState, useEffect } from "react";
import { subscribe, dispatch } from "../../utils/event";
import {
  SEARCH_RESULT,
  USER_INFO,
  USER_INFO_RESULT
} from "../../utils/constants";

let UserContext;
const { Provider, Consumer } = (UserContext = React.createContext());
const subs = [];

const UserProvider = props => {
  const [users, setUsers] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(useLifeCycleEffect.bind(null, setUsers, setUserInfo, setRepos), []);

  return (
    <Provider
      value={{
        users,
        userInfo,
        getUserInfo,
        disposeUserInfo: () => {
          setUserInfo(null);
        },
        repos
      }}
    >
      {props.children}
    </Provider>
  );
};

function useLifeCycleEffect(setUsers, setUserInfo, setRepos) {
  let sub = subscribe(
    SEARCH_RESULT,
    onSearchResult.bind(null, setUsers, setRepos)
  );
  subs.push(sub);
  sub = subscribe(USER_INFO_RESULT, onUserInfo.bind(null, setUserInfo));
  subs.push(sub);

  return () => {
    if (subs.length > 0) {
      subs.forEach(s => s.unsubscribe());
    }
  };
}

function onSearchResult(setUsers, setRepos, action) {
  if (action.payload.searchType === "users") {
    setUsers(action.payload.items);
  } else {
    setRepos(action.payload.items);
  }
}

function getUserInfo({ target }) {
  if (target.tagName != "A") {
    return;
  }

  let li = target.parentNode;
  let username = li.dataset.username;

  dispatch({
    type: USER_INFO,
    payload: {
      username: username
    }
  });
}

function onUserInfo(setUserInfo, action) {
  setUserInfo(action.payload.data);
}

export { UserProvider, Consumer as UserConsumer, UserContext };
