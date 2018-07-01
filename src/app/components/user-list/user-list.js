import React, { Component } from "react";

import "./user-list.css";
import UserCard from "../user-card/user-card";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  usersToLi(users) {
    return users.map(u => {
      return <UserCard key={u.id} user={u}/>
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
