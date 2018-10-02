import React, { Component } from "react";

class UserCard extends Component {
  state;

  render() {
    let user = this.props.user;
    
    if(user.__typename != "User") return null;

    return (
      <li>
        <div className="user-detail">
          <img src={user.avatarUrl} />
          <div>
            <span id="name">
              {user.name} (<a href={user.url} target="_blank">
                {user.login}
              </a>)
            </span>
            <div id="bio" title={user.bio}>{user.bio}</div>
            <div>
              <span className="location"></span>
              {user.location ? user.location : "(n/a)"}
            </div>
            <div>
              <label>Followers: </label>
              <span>{user.followers.totalCount}  </span>
              <label>Following: </label>
              <span>{user.following.totalCount} </span>
              <label>Repos: </label>
              <span>{user.repositories.totalCount}</span>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default UserCard;
