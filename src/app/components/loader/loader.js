import React, { Component } from "react";

import './loader.css';
import { subscribe } from "../../utils/event";
import { LOADER } from "../../utils/constants";

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };

    subscribe(LOADER, (action) => this.setState({
      show: action.payload.show
    }));
  }

  render() {
    return (
      <div id="loader" style={{display:(this.state.show ? "block" : "none")}}>
        <div id="loader-ball-1" className="loader-ball" />
        <div id="loader-ball-2" className="loader-ball" />
        <div id="loader-ball-3" className="loader-ball" />
      </div>
    );
  }
}

export default Loader;
