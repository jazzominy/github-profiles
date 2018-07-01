import React, { Component } from "react";

import "./user-details.css";

class UserDetails extends Component {
  render() {
    let user = this.props.user;
    return (
      <div id="user-details">
        <img src={user.avatar_url} />
        <div id="info">
          <span className="name">
            {user.name} (<a href={user.html_url} target="_blank">
              {user.login}
            </a>)
          </span>
          <div>{user.bio}</div>
          <div>
            <label>Location: </label>
            {user.location}
          </div>
          <div>
            <label>Followers: </label>
            <span>{user.followers}</span> <label>Following: </label>
            <span>{user.following}</span>
          </div>
          <div>
            <label>Repositories: </label>
            <span>{user.public_repos}</span>
          </div>
        </div>
        <span className="close-btn" onClick={this.props.dispose}>&times;</span>
      </div>
    );
  }
}

export default UserDetails;
