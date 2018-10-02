import React, { Component } from "react";
import "./search.css";
import { dispatch } from "../../utils/event";
import { SEARCH, RESET_USER_LIST, RESET_REPO_LIST } from "../../utils/constants";

class SearchIp extends Component {
  textIp;
  params;

  constructor(props) {
    super(props);

    this.state = {};
    this.params = {
      query: "",
      searchType: "USER"
    };
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
      let type = this.params.searchType == 'USER' ? RESET_USER_LIST : RESET_REPO_LIST;
      
      dispatch({
        type 
      });

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
          ref={ref => this.textIp = ref}
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
