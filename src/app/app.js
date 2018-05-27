import React, { Component } from "react";

import "./app.css";
import { dispatch, subscribe } from "./utils/event";
import { USERS, USERS_RESULT } from "./utils/constants";
import UserList from "./components/user-list/user-list";
import UserSearchIp from "./components/search/search";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };

    subscribe(USERS_RESULT, this.onUsersResult.bind(this));
  }

  componentDidMount() {
    /* dispatch({
      type: USERS
    }); */
  }

  onUsersResult(action) {
    this.setState({
      users: action.payload
    });
  }

  render() {
    let view = this.renderSearchIp();

    if(this.state.users.length) {
      view = this.renderUserResult();
    }

    return view;
  }

  renderSearchIp() {
    return (
      <div>
        <UserSearchIp />
      </div>
    )
  }

  renderUserResult() {
    return (
      <div>
        <UserSearchIp />
        <UserList users={this.state.users} />
      </div>
    );
  }
}

export default App;
