import React, { Component } from "react";

import "./user-list.css";
import UserCard from "../user-card/user-card";
import { NAVIGATE_SEARCH_RESULTS, RESET_USER_LIST } from "../../utils/constants";
import { dispatch, subscribe } from "../../utils/event";

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fadeOut: false,
      //Use state to hold records as we are loading next set on scroll end
      users: props.users
    };
  }

  usersToLi(users) {
    return users.map(u => {
      return <UserCard key={u.cursor} user={u.node}/>
    });
  }

  onScroll(e) {
    //Only entertain scroll event on ul
    if(e.target !== e.currentTarget) {
      return;
    }

    let isAtTheEnd = (e.target.scrollHeight - parseInt(e.target.scrollTop)) == (e.target.clientHeight + 1);
    
    if(isAtTheEnd) {
      dispatch({
        type: NAVIGATE_SEARCH_RESULTS,
        payload: {
          direction:"next",
          searchType: this.props.searchType
        }
      });
    }
  }

  //Since we need to add newly fetched data to existing list, do it here
  componentWillReceiveProps(nextProps) {
    this.setState({
      users: this.state.users.concat(nextProps.users)
    })
  }

  render() {
    let cname = this.state.fadeOut ? "fadeOut" : "fadeIn";

    return (
      <div className="user-grid-wrapper">
        <ul id="user-grid" className={cname} onScroll={this.onScroll.bind(this)}>{this.usersToLi(this.state.users)}</ul>
      </div>
    );
  }

  componentDidMount() {
    subscribe(RESET_USER_LIST, this.onReset.bind(this));
  }

  onReset(action) {
    this.setState({
      users: []
    })
  }
}

export default UserList;
