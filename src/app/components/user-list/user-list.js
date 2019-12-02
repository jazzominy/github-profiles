import React, { Component } from "react";

import "./user-list.css";
import UserCard from "../user-card/user-card";
import UserDetails from "../user-details/user-details";
import {
  RESET_SEARCH_RESULT,
  USER_INFO_RESULT,
  USER_INFO
} from "../../utils/constants";
import { dispatch, subscribe } from "../../utils/event";

class UserList extends Component {
  uLRef;
  subscriptions;

  constructor(props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      userInfo: null,
      fadeOut: false,
    };
  }

  setUlRef(ref) {
    this.uLRef = ref;
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
        <ul id="user-grid" ref={this.setUlRef.bind(this)} className={cname} onClick={this.getUserInfo.bind(this)}>
          {this.props.users ? this.usersToLi(this.props.users) : null}
        </ul>
        {userInfo}
      </div>
    );
  }

  componentDidMount() {
    let sub = subscribe(USER_INFO_RESULT, this.onUserInfo.bind(this));
    this.subscriptions.push(sub);
    sub = subscribe(RESET_SEARCH_RESULT, this.onReset.bind(this));
    this.subscriptions.push(sub);
  }

  componentWillUnmount() {
    this.subscriptions.forEach(s => s.unsubscribe());
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

  onReset(action) {
    this.setState({
      users: [],
      fadeOut: false
    });
  }
}

export default UserList;
