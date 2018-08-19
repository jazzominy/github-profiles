import React, { Component } from "react";

import "./repo-list.css";
import { dispatch } from "../../utils/event";
import { NAVIGATE_SEARCH_RESULTS } from "../../utils/constants";

class RepoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeOut: false,
      //Use state to hold records as we are loading next set on scroll end
      repos: props.repos
    };
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
            <span id="owner-info">(owner - <a href={r.node.owner.url} target="_blank">{r.node.owner.login}</a>)</span>
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
    let isAtTheEnd = (e.target.scrollHeight - parseInt(e.target.scrollTop)) == (e.target.clientHeight + 1);
    
    if(isAtTheEnd) {
      dispatch({
        type: NAVIGATE_SEARCH_RESULTS,
        payload: {
          direction:"next",
          searchType: this.props.searchType
        }
      });
    }
  }

  //Since we need to add newly fetched data to existing list, do it here
  componentWillReceiveProps(nextProps) {
    this.setState({
      repos: this.state.repos.concat(nextProps.repos)
    })
  }

  render() {
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";
    return (
      <div className="repo-grid-wrapper">
        <ul id="repo-grid" className={cname} onScroll={this.onScroll.bind(this)}>{this.reposToLi(this.state.repos)}</ul>
      </div>
    );
  }
}

export default RepoList;
