import React, { Component } from "react";

import "./app.css";
import { dispatch, subscribe } from "./utils/event";
import { SEARCH_RESULT } from "./utils/constants";
import UserList from "./components/user-list/user-list";
import SearchIp from "./components/search/search";
import RepoList from "./components/repo-list/repo-list";
import Paginator from "./components/page-navigator/paginator";
import Loader from "./components/loader/loader";
import Notification from "./components/notification/notification";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };

    this.searchIp = <SearchIp />;

    subscribe(SEARCH_RESULT, this.onSerchResult.bind(this));
  }

  componentDidMount() {}

  onSerchResult(action) {
    this.setState({
      items: action.payload.items,
      searchType: action.payload.searchType,
      links: action.payload.links,
      resultCount: action.payload.total_count,
      pageInfo: action.payload.pageInfo
    });
  }

  render() {
    let view = null;
    let count = null;

    if (this.state.items.length) {
      view =
        this.state.searchType == "USER" ? (
          <UserList users={this.state.items} />
        ) : (
          <RepoList repos={this.state.items} />
        );

      count = (
        <div className="result-count">
          <div className="count">Total result count: {this.state.resultCount}</div>
          <Paginator pageInfo={this.state.pageInfo} searchType={this.state.searchType}/>
        </div>
      );
    }

    return (
      <div style={{height:'100%'}}>
        <Notification />
        {this.searchIp}
        {count}
        {view}
        <Loader />
      </div>
    );
  }
}

export default App;
