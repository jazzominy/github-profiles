import React, { Component } from "react";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "./search.css";
import { dispatch } from "../../utils/event";
import { SEARCH } from "../../utils/constants";

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
      searchType: "USER"
    };
  }

  setIpRef(ref) {
    this.textIp = ref;
  }

  componentDidMount() {
    if (this.textIp) {
      
    }
  }

  onOptionChange(e) {
    this.params.searchType = e.target.value;
    
    if(!this.params.query) {
      return;
    }

    dispatch({
      type: SEARCH,
      payload: this.params
    });
  }

  onKeyPress(e) {
    this.params.query = e.target.value;
    
    if(e.charCode === 13){
      dispatch({
        type: SEARCH,
        payload: this.params
      });
    }
  }

  render() {
    return (
      <div className="search-wrapper">
        <input
          type="search"
          placeholder="Search Github"
          ref={this.setIpRef.bind(this)}
          onKeyPress={this.onKeyPress.bind(this)}
        />
        <div className="options-wrapper">
          <label>
            <input
              name="search-option"
              type="radio"
              value="USER"
              defaultChecked
              onChange={this.onOptionChange.bind(this)}
            />Users
          </label>
          <label>
            <input
              name="search-option"
              type="radio"
              value="REPOSITORY"
              onChange={this.onOptionChange.bind(this)}
            />Repositories
          </label>
        </div>
      </div>
    );
  }
}

export default SearchIp;
