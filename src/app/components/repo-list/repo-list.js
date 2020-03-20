import React, { useContext } from "react";

import "./repo-list.css";
import { UserContext } from "../context/user-context";

const RepoListV2 = props => {
  const { repos } = useContext(UserContext);

  function reposToLi(repos) {
    return repos.map(r => {
      let starCount =
        r.stargazers_count > 1000
          ? (r.stargazers_count / 1000).toFixed(1) + "k"
          : r.stargazers_count;
      let forkCount =
        r.forks_count > 1000
          ? (r.forks_count / 1000).toFixed(1) + "k"
          : r.forks_count;
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

  return (
    <div className="repo-grid-wrapper">
      <ul id="repo-grid">{repos && reposToLi(repos)}</ul>
    </div>
  );
};

export default RepoListV2;
