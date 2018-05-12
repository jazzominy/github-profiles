import React, { Component } from "react";

import "./app.css";
import { dispatch, subscribe } from "./utils/event";
import { USERS, USERS_RESULT } from "./utils/constants";
import UserList from "./components/user-list/user-list";

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

  render() {
    return <UserList users={this.state.users} />;
  }
}

export default App;
