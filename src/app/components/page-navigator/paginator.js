import React, { Component } from 'react';

import "./paginator.css";
import { dispatch } from "../../utils/event";
import { NAVIGATE_SEARCH_RESULTS } from "../../utils/constants";

class Paginator extends Component {
  constructor(props) {
    super(props);
  }

  linksToBtns(pageInfo) {
    if(!pageInfo) {
      return [];
    }

    let navs = [];
    
    if(pageInfo.hasPreviousPage)navs.push("prev");
    if(pageInfo.hasNextPage)navs.push("next");

    return navs.map(nav => {
      return this.getBtn(nav,"");
    })
  }

  getBtn(nav,url) {
    let handler = this.navigate.bind(this,"next");
    let btn = <button key="1" onClick={handler}>&gt;</button>;

    if(nav == "first") {
      btn = <button key="2" onClick={handler}>First</button>;
    }
    else if(nav == "currentPage") {
      btn = <span key="5">{url}</span>
    }
    else if(nav == "prev") {
      btn = <button key="3" onClick={this.navigate.bind(this,"prev")}>&lt;</button>;
    }
    else if(nav == "last") {
      btn = <button key="4" onClick={handler}>Last</button>;
    }

    return btn;
  }

  render() { 
    let btns = this.linksToBtns(this.props.pageInfo);
    return <div className="pagination">{btns}</div>;
  }

  navigate(direction) {
    dispatch({
      type: NAVIGATE_SEARCH_RESULTS,
      payload: {
        direction,
        searchType: this.props.searchType
      }
    })
  }
}
 
export default Paginator;