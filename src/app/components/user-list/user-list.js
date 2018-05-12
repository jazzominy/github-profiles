import React, { Component } from "react";

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
    return <ul id="user-grid">{this.usersToLi(this.props.users)}</ul>;
  }
}

export default UserList;
