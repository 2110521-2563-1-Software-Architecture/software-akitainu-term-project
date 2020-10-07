import React from 'react'
import Redirect from './Redirect'
import { useHistory } from "react-router";

function AuthGuard({ children }) {
  const history = useHistory()

  if (!sessionStorage.getItem("userId")) {
    return <Redirect to="/home"/>
  }

  return children
}
export default AuthGuard