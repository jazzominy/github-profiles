import React, { Component } from "react";

import "./app.css";
import { dispatch, subscribe } from "./utils/event";
import { SEARCH_RESULT, NAVIGATE_SEARCH_RESULTS } from "./utils/constants";
import UserList from "./components/user-list/user-list";
import SearchIp from "./components/search/search";
import RepoList from "./components/repo-list/repo-list";
import Paginator from "./components/page-navigator/paginator";
import Loader from "./components/loader/loader";
import Notification from "./components/notification/notification";

let PageLoader = (props) => {
  return (
    <div id="boundary" className={props.show ? 'slideUp':''}>
      <div id="ball"></div>
    </div>
  )
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      showPageLoader: false
    };

    this.searchIp = <SearchIp />;
    subscribe(SEARCH_RESULT, this.onSerchResult.bind(this));
    subscribe(NAVIGATE_SEARCH_RESULTS, this.displayPageLoader.bind(this));
  }

  componentDidMount() {}

  onSerchResult(action) {
    this.setState({
      items: action.payload.items,
      searchType: action.payload.searchType,
      links: action.payload.links,
      resultCount: action.payload.total_count,
      showPageLoader: false
    });
  }

  render() {
    let view = null;
    let count = null;

    if (this.state.items.length) {
      view =
        this.state.searchType == "USER" ? (
          <UserList users={this.state.items} searchType={this.state.searchType} links={this.state.links}/>
        ) : (
          <RepoList repos={this.state.items} searchType={this.state.searchType} links={this.state.links}/>
        );

      count = (
        <div className="result-count">
          <div className="count">Total result count: {this.state.resultCount}</div>
          {/* <Paginator links={this.state.links} searchType={this.state.searchType}/> */}
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
        <PageLoader show={this.state.showPageLoader}/>
      </div>
    );
  }

  displayPageLoader(action) {
    this.setState({
      showPageLoader: true
    })
  }
}

export default App;
