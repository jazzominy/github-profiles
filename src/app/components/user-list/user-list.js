import React, { Component } from "react";
import { Observable } from "rxjs/Observable";

import "./user-list.css";
import UserCard from "../user-card/user-card";
import UserDetails from "../user-details/user-details";
import {
  NAVIGATE_SEARCH_RESULTS,
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
      fadeOut: false,
      //Use state to hold records as we are loading next set on scroll end
      users: props.users
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

  onScroll(e) {
    let isAtTheEnd = parseInt(e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight <= 1;

    if (isAtTheEnd && this.props.links && "next" in this.props.links) {
      dispatch({
        type: NAVIGATE_SEARCH_RESULTS,
        payload: {
          url: this.props.links.next,
          searchType: this.props.searchType
        }
      });
    }
  }

  //Since we need to add newly fetched data to existing list, do it here
  componentWillReceiveProps(nextProps) {
    /**
     * Since page loader is displayed in app.js for infinite scrolling,
     * the state of this component is updated with same array of users that are already displayed
     * So to avoid this update, a check is put
     */
    if(this.state.users === nextProps.users) {
      return;
    }

    let newSet = nextProps.users;
    let len = this.state.users.length, i = len;

    //Add existing array of users to new array of users for the above check to work correctly i.e
    //if nextProps.users is same as last result, dont go ahead with the update
    while(--i >= 0) {
      newSet.unshift(this.state.users[i]);
    }

    this.setState({
      users: newSet
    });
  }

  render() {
    let userInfo = this.state.userInfo ? <UserDetails user={this.state.userInfo} dispose={this.disposeUserInfo.bind(this)}/> : null;
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";

    return (
      <div className="user-grid-wrapper">
        <ul id="user-grid" ref={this.setUlRef.bind(this)} className={cname} onClick={this.getUserInfo.bind(this)}>
          {this.usersToLi(this.state.users)}
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

    //Debounce the scroll event as it is fired too often.
    //This avoids accidental multiple api calls.
    //Also it guarantees that api will be called when list is scrolled till the end
    let scrollStream = Observable.fromEvent(this.uLRef, "scroll").debounceTime(
      100
    );
    sub = scrollStream.subscribe(this.onScroll.bind(this));
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
