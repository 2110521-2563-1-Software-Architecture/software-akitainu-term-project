import React from "react";
import Redirect from "./Redirect";
import { useHistory } from "react-router";

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function GameplayGuard({ children }) {
  let userId = sessionStorage.getItem("userId");
  if (!userId) {
    return <Redirect to="/login" />;
  }
  if (!isNumeric(userId)) {
    return <Redirect to="/login" />;
  }

  return children;
}
export default GameplayGuard;
