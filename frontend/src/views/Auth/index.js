import React, { useEffect, useState } from 'react'
import GoogleLogin from "react-google-login";
import { 
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core'
import { Palette } from 'components'
import Redirect from 'components/Redirect'
import { useHistory } from "react-router";
import { SnackbarProvider, useSnackbar } from 'notistack';
import background from 'image/shibaBackground.svg'

const useStlyes = makeStyles((the)=>({
  root : {
    display:"flex",
    justifyContent:"center",
    height:"100vh",
    alignItems:"center",
    flexDirection:"column",
    backgroundImage:`url(${background})`,
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

var userId_tmp
var userName_tmp


function Auth() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "315916359879-9hc3ac4snn53s7cma3rbfbotm84q6tfl.apps.googleusercontent.com"
  const history = useHistory();
  const classes = useStlyes()
  // const [showNoti,setShowNoti] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const [userName,setUserName] = useState("")
  const isDevEnv = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' 

  const onLoginSuccess = (userName) => {
    if (userName) {
      enqueueSnackbar(`Welcome ${userName} (${userId_tmp})`,{variant:"success"});
    }
    else {
      enqueueSnackbar(`logged in as ${userId_tmp}`,{variant:"success"});
    }
    setTimeout(function(){
      enqueueSnackbar(`Entering the game`);
    }, 1000);
    setTimeout(function(){
      history.push("/home"); 
    }, 3000);
  }
  // useEffect(()=>{
  //   console.log(userName)
  // },[userName])

  const mockUserId = () => {
    userId_tmp = Math.floor(100000 + Math.random() * 900000);
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
      onLoginSuccess(profile.getName())
    }
  }

  function onDevSignIn() {
    mockUserId()
    onLoginSuccess()
  }

  // const handleClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setShowNoti(false);
  // };

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
      {/* <Snackbar
        key={`snackbar-authguard`}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={showNoti}
        autoHideDuration={3000}
        onClose={handleClose}
        message={userId_tmp ? `logged in as ${userId_tmp}` : undefined}
      /> */}
    </div>
  )
}
export default function Authen() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Auth />
    </SnackbarProvider>
  );
}