import React, { Component } from "react";

import "./user-list.css";
import { dispatch, subscribe } from "../../utils/event";
import UserCard from "../user-card/user-card";
import { USER_INFO_RESULT, USER_INFO } from "../../utils/constants";
import UserDetails from "../user-details/user-details";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeOut: false
    };
  }

  usersToLi(users) {
    return users.map(u => {
      return <UserCard key={u.id} user={u}/>
    });
  }

  render() {
    let userInfo = this.state.userInfo ? <UserDetails user={this.state.userInfo} dispose={this.disposeUserInfo.bind(this)}/> : null;
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";

    return (
      <div className="user-grid-wrapper">
        <ul id="user-grid" className={cname} onClick={this.getUserInfo.bind(this)}>{this.usersToLi(this.props.users)}</ul>
        {userInfo}
      </div>
    );
  }

  componentDidMount() {
    subscribe(USER_INFO_RESULT, this.onUserInfo.bind(this));
  }

  getUserInfo(e) {
    if(e.target.tagName != "A") {
      return;
    }

    let li = e.target.parentNode;
    let username = li.dataset.username;

    dispatch({
      type: USER_INFO,
      payload: {
        username: username
      }
    })
  }

  onUserInfo(action) {
    this.setState({
      userInfo: action.payload.data,
      fadeOut: true
    })
  }

  disposeUserInfo() {
    this.setState({
      userInfo: null,
      fadeOut: false
    });
  }
}

export default UserList;
