import React, { Component } from "react";

import "./user-list.css";
import UserCard from "../user-card/user-card";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeOut: false
    };
  }

  usersToLi(users) {
    return users.map(u => {
      return <UserCard key={u.node.id} user={u.node}/>
    });
  }

  render() {
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";

    return (
      <div className="user-grid-wrapper">
        <ul id="user-grid" className={cname}>{this.usersToLi(this.props.users)}</ul>
      </div>
    );
  }

  componentDidMount() {}
}

export default UserList;
