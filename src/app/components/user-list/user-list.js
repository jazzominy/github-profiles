import React, { Component } from "react";

import "./user-list.css";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  usersToLi(users) {
    return users.map(u => {
      return (
        <li key={u.id}>
          <a href={u.html_url} target="_blank">
            <img src={u.avatar_url} />
            {u.login}
          </a>
        </li>
      );
    });
  }

  render() {
    return (
      <div className="user-grid-wrapper">
        <ul id="user-grid">{this.usersToLi(this.props.users)}</ul>
      </div>
    );
  }
}

export default UserList;
