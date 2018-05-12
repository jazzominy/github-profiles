import React, { Component } from "react";

import "./app.css";
import { dispatch, subscribe } from "./utils/event";
import { USERS, USERS_RESULT } from "./utils/constants";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };

    subscribe(USERS_RESULT, this.onUsersResult.bind(this));
  }

  componentDidMount() {
    dispatch({
      type: USERS
    });
  }

  onUsersResult(action) {
    this.setState({
      users: action.payload
    });
  }

  usersToLi(users) {
    return users.map(u => {
      return (
        <li key={u.id}>
          <a href={u.html_url} target="_blank">
            <img src={u.avatar_url} />{u.login}
          </a>
        </li>
      );
    });
  }

  render() {
    return <ul id="user-grid">{this.usersToLi(this.state.users)}</ul>;
  }
}

export default App;
