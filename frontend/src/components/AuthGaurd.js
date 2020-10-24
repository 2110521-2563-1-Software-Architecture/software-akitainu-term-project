import React, {useState, useEffect, useMemo} from "react";
import Redirect from "./Redirect";
import {
  Snackbar,
} from '@material-ui/core'
import { useHistory } from "react-router";

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

function AuthGaurd({ children }) {
  const [userId,setUserId] = useState(sessionStorage.getItem("userId"))


  if (!userId) {
    return <Redirect to="/login" />;
  }
  if (!isNumeric(userId)) {
    return <Redirect to="/login" />;
  }



  return (
    <div>
      {children}
      
    </div>
  );
}
export default AuthGaurd;
