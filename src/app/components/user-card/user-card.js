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
          <div className="info">
            <span className="name">
              {user.name} (<a href={user.url} target="_blank">
                {user.login}
              </a>)
            </span>
            <div title={user.bio}>{user.bio}</div>
            <div>
              <span className="location"></span>
              {user.location}
            </div>
            <div>
              <label>Followers: </label>
              <span>{user.followers.totalCount}  </span>
              <label>Following: </label>
              <span>{user.following.totalCount}</span>
            </div>
            <div>
              <label>Repositories: </label>
              <span>{user.repositories.totalCount}</span>
            </div>
          </div>
        </div>
      </li>
    );
  }
}

export default UserCard;
