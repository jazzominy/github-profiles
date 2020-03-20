import React from "react";

const UserCard = ({ user }) => (
  <li data-username={user.login}>
    <a>
      <img src={user.avatar_url} />
      {user.login}
    </a>
  </li>
);
export default UserCard;
