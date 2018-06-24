import React, { Component } from 'react';

import "./paginator.css";
import { dispatch } from "../../utils/event";
import { NAVIGATE_SEARCH_RESULTS } from "../../utils/constants";

class Paginator extends Component {
  constructor(props) {
    super(props);
  }

  linksToBtns(links) {
    if(!links) {
      return [];
    }

    let navs = [];
    //Maintain the button order
    if("first" in links) navs.push("first");
    if("prev" in links) navs.push("prev");
    if("currentPage" in links) navs.push("currentPage");
    if("next" in links) navs.push("next");
    if("last" in links) navs.push("last");

    return navs.map(nav => {
      return this.getBtn(nav,links[nav]);
    })
  }

  getBtn(nav,url) {
    let handler = this.navigate.bind(this,url);
    let btn = <button key="1" onClick={handler}>&gt;</button>;

    if(nav == "first") {
      btn = <button key="2" onClick={handler}>First</button>;
    }
    else if(nav == "currentPage") {
      btn = <span>{url}</span>
    }
    else if(nav == "prev") {
      btn = <button key="3" onClick={handler}>&lt;</button>;
    }
    else if(nav == "last") {
      btn = <button key="4" onClick={handler}>Last</button>;
    }

    return btn;
  }

  render() { 
    let btns = this.linksToBtns(this.props.links);
    return <div className="pagination">{btns}</div>;
  }

  navigate(url) {
    dispatch({
      type: NAVIGATE_SEARCH_RESULTS,
      payload: {
        url,
        searchType: this.props.searchType
      }
    })
  }
}
 
export default Paginator;