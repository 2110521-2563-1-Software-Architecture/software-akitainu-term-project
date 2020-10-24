import React from 'react'
import GoogleLogin from "react-google-login";
import { 
  Button,
  makeStyles,
} from '@material-ui/core'
import { Palette } from 'components'
import Redirect from 'components/Redirect'
import { useHistory } from "react-router";

const useStlyes = makeStyles((the)=>({
  root : {
    display:"flex",
    justifyContent:"center",
    height:"100vh",
    alignItems:"center",
    flexDirection:"column",
  },
  googleButton: {
    background: "#2F80ED",
    height: "40px",
    color: "white",
    width: "130px",
    margin:"8px 0",
    "&:hover": {
      background: "#2F80ED",
    },
  },
  devLoginButton: {
    background: "#2F80ED",
    height: "40px",
    color: "white",
    width: "130px",
    margin:"8px 0",
    "&:hover": {
      background: "#2F80ED",
    },
  },
}))

function Auth() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "315916359879-9hc3ac4snn53s7cma3rbfbotm84q6tfl.apps.googleusercontent.com"
  const history = useHistory();
  const classes = useStlyes()
  const isDevEnv = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' 

  const onLoginSuccess = () => {
    history.push("/home");
  }

  const mockUserId = () => {
    var userId_tmp = Math.floor(100000 + Math.random() * 900000);
    window.sessionStorage.setItem("userId", userId_tmp);
  }

  function onSignIn(googleUser) {
    console.log("success");
    var profile = googleUser.getBasicProfile();
    console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log("Name: " + profile.getName());
    console.log("Image URL: " + profile.getImageUrl());
    console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    console.log(googleUser);
    if (googleUser.accessToken) {
      mockUserId()
      onLoginSuccess()
    }
  }

  function onDevSignIn() {
    mockUserId()
    onLoginSuccess()
  }

  return (
    <div className={classes.root}>
      <GoogleLogin
        clientId={clientId}
        render={renderProps => (
          <Button 
            className={classes.googleButton}
            onClick={renderProps.onClick} 
            disabled={renderProps.disabled}>
              Google
          </Button>
        )}
        buttonText="Login"
        onSuccess={onSignIn}
        onFailure={onSignIn}
        cookiePolicy={'single_host_origin'}
      />
      {isDevEnv&&<Button
        className={classes.devLoginButton}
        onClick={()=>onDevSignIn()}
        >
        dev login
      </Button>}
    </div>
  )
}
export default Auth