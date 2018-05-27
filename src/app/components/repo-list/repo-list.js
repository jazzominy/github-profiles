import React, { Component } from 'react';

import "./repo-list.css";

class RepoList extends Component {
  constructor(props) {
    super(props);
    this.state = {  }
  }

  reposToLi(repos) {
    return repos.map(r => {
      return (
        <li key={r.id}>
          <h3>
            <a href={r.html_url} target="_blank" title={r.full_name}>
              {r.full_name}
            </a>
          </h3>
          <span>{r.description}</span>
        </li>
      );
    });
  }

  render() { 
    return ( 
      <div className="repo-grid-wrapper">
        <ul id="repo-grid">{this.reposToLi(this.props.repos)}</ul>
      </div>
    );
  }
}
 
export default RepoList;