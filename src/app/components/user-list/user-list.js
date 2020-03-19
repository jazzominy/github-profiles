import React, { Component, useContext } from "react";

import "./user-list.css";
import UserCard from "../user-card/user-card";
import UserDetails from "../user-details/user-details";
import { UserContext } from "../context/user-context";

const UserListV2 = props => {
  const { users, userInfo, getUserInfo, disposeUserInfo } = useContext(
    UserContext
  );
  let cname = userInfo ? "fadeOut" : "fadeIn";
  return (
    <div className="user-grid-wrapper">
      <ul id="user-grid" onClick={getUserInfo} className={cname}>
        {users &&
          users.map(u => {
            return <UserCard key={u.id} user={u} />;
          })}
      </ul>
      {userInfo && <UserDetails user={userInfo} dispose={disposeUserInfo} />}
    </div>
  );
};

export default UserListV2;
