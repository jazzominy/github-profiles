import React, { Component } from "react";
import { Observable } from "rxjs";
import "./search.css";
import { dispatch } from "../../utils/event";
import { SET_USER_SEARCH_STREAM } from "../../utils/constants";

class UserSearchIp extends Component {
  textIp;
  searchStream;

  constructor(props) {
    super(props);
    this.state = {};
  }

  setIpRef(ref) {
    this.textIp = ref;
  }

  componentDidMount() {
    if (this.textIp) {
      this.searchStream = Observable.fromEvent(this.textIp, "keyup")
        .map(e => e.target.value)
        //.filter(keyword => keyword && keyword.length > 3);

      dispatch({
        type: SET_USER_SEARCH_STREAM,
        payload: {
          searchStream: this.searchStream
        }
      });
    }
  }

  render() {
    return (
      <div className="search-wrapper">
        <input type="search" placeholder="Search" ref={this.setIpRef.bind(this)} />
      </div>
    );
  }
}

export default UserSearchIp;
