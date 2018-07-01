import React, { Component } from "react";

class UserCard extends Component {
  state;

  render() {
    let u = this.props.user;

    return (
      <li data-username={u.login}>
        <a>
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
