import React from "react";
import newRequest from "../../utils/newRequest";

const MessageCard = async (c) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  console.log(c);
  let id = currentUser.isSeller ? c["buyerId"] : c["sellerId"];
  console.log(id);
  let username = (await newRequest.get(`/users/${id}`)).data["username"];
  return <div>{username}</div>;
};

export default MessageCard;
