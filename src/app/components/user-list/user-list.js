import React, { Component } from "react";

import "./user-list.css";
import UserCard from "../user-card/user-card";
import {
  NAVIGATE_SEARCH_RESULTS,
  RESET_USER_LIST
} from "../../utils/constants";
import { dispatch, subscribe } from "../../utils/event";
import { Observable } from "rxjs/Observable";

class UserList extends Component {
  uLRef;

  constructor(props) {
    super(props);
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
      return <UserCard key={u.cursor} user={u.node} />;
    });
  }

  onScroll(e) {
    let isAtTheEnd = parseInt(e.target.scrollHeight - e.target.scrollTop) - e.target.clientHeight <= 1;

    if (isAtTheEnd) {
      dispatch({
        type: NAVIGATE_SEARCH_RESULTS,
        payload: {
          direction: "next",
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
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";

    return (
      <div className="user-grid-wrapper">
        <ul id="user-grid" ref={this.setUlRef.bind(this)} className={cname}>
          {this.usersToLi(this.state.users)}
        </ul>
      </div>
    );
  }

  componentDidMount() {
    subscribe(RESET_USER_LIST, this.onReset.bind(this));

    //Debounce the scroll event as it is fired too often.
    //This avoids accidental multiple api calls.
    //Also it guarantees that api will be called when list is scrolled till the end
    let scrollStream = Observable.fromEvent(this.uLRef, "scroll").debounceTime(
      100
    );
    scrollStream.subscribe(this.onScroll.bind(this));
  }

  onReset(action) {
    this.setState({
      users: []
    });
  }
}

export default UserList;
