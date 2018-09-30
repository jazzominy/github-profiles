import React, { Component } from "react";
import { Observable } from "rxjs/Observable";

import "./repo-list.css";
import { dispatch, subscribe } from "../../utils/event";
import {
  NAVIGATE_SEARCH_RESULTS,
  RESET_REPO_LIST
} from "../../utils/constants";

class RepoList extends Component {
  uLRef;

  constructor(props) {
    super(props);
    this.state = {
      fadeOut: false,
      //Use state to hold records as we are loading next set on scroll end
      repos: props.repos
    };
  }

  setUlRef(ref) {
    this.uLRef = ref;
  }

  reposToLi(repos) {
    return repos.map(r => {
      return (
        <li key={r.cursor}>
          <img src={r.node.owner.avatarUrl} />
          <h3>
            <a href={r.node.url} target="_blank" title={r.node.name}>
              {r.node.name}
            </a>
            <span id="owner-info">
              (owner -{" "}
              <a href={r.node.owner.url} target="_blank">
                {r.node.owner.login}
              </a>
              )
            </span>
          </h3>
          <span id="desc">{r.node.description}</span>
          <div id="stats">
            <div>
              <span>
                <svg
                  className="star"
                  viewBox="0 0 14 16"
                  version="1.1"
                  width="14"
                  height="16"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
                  />
                </svg>
              </span>
              <span>{r.node.stargazers.totalCount}</span>
            </div>
            <div>
              <span className="fork" />
              <span>{r.node.forkCount}</span>
            </div>
          </div>
        </li>
      );
    });
  }

  onScroll(e) {
    let isAtTheEnd = parseInt(e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight <= 1;

    if (isAtTheEnd) {
      dispatch({
        type: NAVIGATE_SEARCH_RESULTS,
        payload: {
          direction: "next",
          searchType: this.props.searchType
        }
      });
    }
  }

  //Since we need to add newly fetched data to existing list, do it here
  componentWillReceiveProps(nextProps) {
    /**
     * Since page loader is displayed in app.js for infinite scrolling,
     * the state of this component is updated with same array of repos that are already displayed
     * So to avoid this update, a check is put
     */
    if(this.state.repos === nextProps.repos) {
      return;
    }

    let newSet = nextProps.repos;
    let len = this.state.repos.length, i = len;

    //Add existing array of repos to new array of repos for the above check to work correctly i.e
    //if nextProps.repos is same as last result, dont go ahead with the update
    while(--i >= 0) {
      newSet.unshift(this.state.repos[i]);
    }

    this.setState({
      repos: newSet
    });
  }

  render() {
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";
    return (
      <div className="repo-grid-wrapper">
        <ul id="repo-grid" className={cname} ref={this.setUlRef.bind(this)}>
          {this.reposToLi(this.state.repos)}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    subscribe(RESET_REPO_LIST, this.onReset.bind(this));
    //Debounce the scroll event as it is fired too often.
    //This avoids accidental multiple api calls.
    //Also it guarantees that api will be called when list is scrolled till the end
    let scrollStream = Observable.fromEvent(this.uLRef, "scroll").debounceTime(
      100
    );
    scrollStream.subscribe(this.onScroll.bind(this));
  }

  onReset(action) {
    this.setState({
      repos: []
    });
  }
}

export default RepoList;
