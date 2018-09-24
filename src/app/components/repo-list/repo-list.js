import React, { Component } from "react";
import { Observable } from "rxjs/Observable";

import "./repo-list.css";
import { NAVIGATE_SEARCH_RESULTS, RESET_SEARCH_RESULT } from "../../utils/constants";
import { dispatch, subscribe } from "../../utils/event";

class RepoList extends Component {
  uLRef;
  subscriptions;

  constructor(props) {
    super(props);
    this.state = {
      fadeOut: false,
      //Use state to hold records as we are loading next set on scroll end
      repos: props.repos
    };
    this.subscriptions = [];
  }

  setUlRef(ref) {
    this.uLRef = ref;
  }

  reposToLi(repos) {
    return repos.map(r => {
      let starCount = r.stargazers_count > 1000 ? (r.stargazers_count/1000).toFixed(1)+'k' : r.stargazers_count;
      let forkCount = r.forks_count > 1000 ? (r.forks_count/1000).toFixed(1)+'k' : r.forks_count;
      return (
        <li key={r.id}>
          <img src={r.owner.avatar_url} />
          <h3>
            <a href={r.html_url} target="_blank" title={r.full_name}>
              {r.full_name}
            </a>
          </h3>
          <span id="desc">{r.description}</span>
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
              <span>{starCount}</span>
            </div>
            <div>
              <span className="fork" />
              <span>{forkCount}</span>
            </div>
          </div>
        </li>
      );
    });
  }

  render() {
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";
    return (
      <div className="repo-grid-wrapper">
        <ul id="repo-grid" className={cname} ref={this.setUlRef.bind(this)}>{this.reposToLi(this.state.repos)}</ul>
      </div>
    );
  }

  componentDidMount() {
    let sub = subscribe(RESET_SEARCH_RESULT, this.onReset.bind(this));
    this.subscriptions.push(sub);
    //Debounce the scroll event as it is fired too often.
    //This avoids accidental multiple api calls.
    //Also it guarantees that api will be called when list is scrolled till the end
    let scrollStream = Observable.fromEvent(this.uLRef, "scroll").debounceTime(
      100
    );
    
    sub = scrollStream.subscribe(this.onScroll.bind(this));
    this.subscriptions.push(sub);
  }

  onScroll(e) {
    let isAtTheEnd = parseInt(e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight <= 1;

    if (isAtTheEnd && this.props.links && "next" in this.props.links) {
      dispatch({
        type: NAVIGATE_SEARCH_RESULTS,
        payload: {
          url: this.props.links.next,
          searchType: this.props.searchType
        }
      });
    }
  }
  
  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
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

  onReset(action) {
    this.setState({
      repos: [],
      fadeOut: false
    });
  }  
}

export default RepoList;
