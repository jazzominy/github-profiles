import React, { Component } from "react";

import "./app.css";
import { dispatch, subscribe } from "./utils/event";
import { USERS, USERS_RESULT } from "./utils/constants";
import UserList from "./components/user-list/user-list";
import UserSearchIp from "./components/search/search";
import RepoList from "./components/repo-list/repo-list";
import Paginator from "./components/page-navigator/paginator";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };

    this.searchIp = <UserSearchIp />;

    subscribe(USERS_RESULT, this.onUsersResult.bind(this));
  }

  componentDidMount() {}

  onUsersResult(action) {
    this.setState({
      items: action.payload.items,
      searchType: action.payload.searchType,
      links: action.payload.links,
      resultCount: action.payload.total_count
    });
  }

  render() {
    let view = null;
    let count = null;

    if (this.state.items.length) {
      view =
        this.state.searchType == "users" ? (
          <UserList users={this.state.items} />
        ) : (
          <RepoList repos={this.state.items} />
        );

      count = (
        <div className="result-count">
          <div className="count">Total result count: {this.state.resultCount}</div>
          <Paginator links={this.state.links} searchType={this.state.searchType}/>
        </div>
      );
    }

    return (
      <div>
        {this.searchIp}
        {count}
        {view}
      </div>
    );
  }
}

export default App;
