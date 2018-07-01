import React, { Component } from "react";

import { dispatch } from "../../utils/event";
import { USER_INFO } from "../../utils/constants";

class UserCard extends Component {
  state;

  render() {
    let u = this.props.user;

    return (
      <li>
        <a href={u.html_url} target="_blank">
          <img src={u.avatar_url} />
          {u.login}
        </a>
      </li>
    );
  }

  componentDidMount() {
    /* dispatch({
      type: USER_INFO,
      payload: {
        username: this.props.user.login,
        then: (resp) => this.setState({
          userInfo: resp.data
        })
      }
    }) */
  }
}

export default UserCard;
