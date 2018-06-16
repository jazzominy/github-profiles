import React, { Component } from "react";
import { Observable, Subject } from "rxjs";
import "./search.css";
import { dispatch } from "../../utils/event";
import { SET_SEARCH_STREAM } from "../../utils/constants";

class SearchIp extends Component {
  textIp;
  searchStream;
  params;
  searchTypeSubject;

  constructor(props) {
    super(props);

    this.searchTypeSubject = new Subject();
    this.state = {};
    this.params = {
      query: "",
      searchType: "users"
    };
  }

  setIpRef(ref) {
    this.textIp = ref;
  }

  componentDidMount() {
    if (this.textIp) {
      this.searchStream = Observable.fromEvent(this.textIp, "input").map(e => {
        this.params.query = e.target.value;
        return this.params;
      });

      dispatch({
        type: SET_SEARCH_STREAM,
        payload: {
          searchStream: Observable.merge(
            this.searchStream,
            this.searchTypeSubject
          )
        }
      });
    }
  }

  onOptionChange(e) {
    this.params.searchType = e.target.value;
    this.searchTypeSubject.next(this.params);
  }

  render() {
    return (
      <div className="search-wrapper">
        <input
          type="search"
          placeholder="Search Github"
          ref={this.setIpRef.bind(this)}
        />
        <div className="options-wrapper">
          <label>
            <input
              name="search-option"
              type="radio"
              value="users"
              defaultChecked
              onChange={this.onOptionChange.bind(this)}
            />Users
          </label>
          <label>
            <input
              name="search-option"
              type="radio"
              value="repositories"
              onChange={this.onOptionChange.bind(this)}
            />Repositories
          </label>
        </div>
      </div>
    );
  }
}

export default SearchIp;
