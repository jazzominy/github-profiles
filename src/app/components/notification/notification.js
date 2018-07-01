import React, { Component } from "react";
import { subscribe } from "../../utils/event";
import { NOTIFICATION } from "../../utils/constants";

import "./notification.css";

class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      error: false
    };

    subscribe(NOTIFICATION, this.onNotification.bind(this));
  }

  onNotification(action) {
    this.setState({
      message: action.payload.message,
      isError: action.payload.isError
    });

    this.hideTimer();
  }

  hideTimer() {
    setTimeout(() => {
      this.setState({
        message: "",
        error: false
      })
    },5000)
  }

  render() {
    let cname = this.state.error ? "error" : "success";
    return (
      <div
        id="notification"
        className={cname}
        style={{ display: this.state.message ? "block" : "none" }}
      >
        {this.state.message}
      </div>
    );
  }
}

export default Notification;
