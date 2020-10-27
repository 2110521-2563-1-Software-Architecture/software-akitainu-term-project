import React, { useEffect, useState } from "react";
import GoogleLogin from "react-google-login";
import { Button, makeStyles, Typography } from "@material-ui/core";
import { Palette } from "components";
import Redirect from "components/Redirect";
import { useHistory } from "react-router";
import { SnackbarProvider, useSnackbar } from "notistack";
import background from "image/shibaBackground.svg";
import clsx from "clsx";
import logo from "../../shiba-inu.svg";
import axios from "axios";

const useStlyes = makeStyles((the) => ({
  root: {
    display: "flex",
    justifyContent: "flex-start",
    height: "100vh",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "#465A74",
    backgroundImage: `url(${background})`,
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginTop: "80px",
    // backdropFilter:"blur(4px)",
    // border:"1px solid black",
    padding: "40px 24px",
    borderRadius: "16px",
    maxHeight: "100vh",
  },
  googleButton: {
    background: "#2F80ED",
    color: "white",
    padding: "4px 24px",
    width: "200px",
    fontSize: "24px",
    margin: "8px 0",
    fontFamily: "Quick",
    "&:hover": {
      background: "#2F80ED",
    },
  },
  loginButton: {
    background: "linear-gradient(to right, #FFEFBA, #FFFFFF);",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    "text-shadow": "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
    border: "3px solid #78ffd6",
    padding: "4px 24px",
    width: "280px",
    margin: "16px 0",
    fontFamily: "Quick",
    fontSize: "24px",
    transition: "all 0.3s ease-in-out",
    fontWeight: 600,
    borderRadius: "8px",
    height: "60px",
    backdropFilter: "blur(2px)",
    // "& span": {
    //   position: "absolute",
    //   width: "25%",
    //   height: "100%",
    //   backgroundColor: "red",
    //   transform: "translateY(150%)",
    //   borderRadius: "50%",
    //   left: "calc((var(--n) - 1) * 25%)",
    //   transition: "0.5s",
    //   transitionDelay: "calc((var(--n) - 1) * 0.1s)",
    //   zIndex: -1,
    // },
    // "& span:nth-child(1)" : {
    //   "--n": 1,
    // },
    // "& span:nth-child(2)" : {
    //   "--n": 2,
    // },
    // "& span:nth-child(3)" : {
    //   "--n": 3,
    // },
    // "& span:nth-child(4)" : {
    //   "--n": 4,
    // },
    "&:hover": {
      // border:"1px solid #ffa751",
      transform: "scale(1.2)",
      // boxShadow: "inset 6.5em 0 0 0 red",
      // border:"3px sold #ef8e38"
    },
  },
  title: {
    transition: "all 0.3s ease-in-out",
    paddingBottom: "32px",
    fontFamily: "Quick",
    fontSize: "64px",
    // fontWeight:800,
    // background:"linear-gradient(to right, #a8ff78, #78ffd6);",
    background: "linear-gradient(to right, #FFEFBA, #FFFFFF);",
    cursor: "pointer",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    // "text-shadow": "rgba(17, 12, 46, 0.15) 0px 48px 100px 0px",
    // textShadow:"2px 2px 4px #000000",
    "&:hover": {
      // border:"1px solid #ffa751",
      transform: "scale(1.2)",
      // boxShadow: "inset 6.5em 0 0 0 red",
    },
  },
  // slide : {
  //   "& :hover" : {
  //     boxShadow: "inset 6.5em 0 0 0 red",
  //   },
  //   "&:focus" : {
  //     boxShadow: "inset 6.5em 0 0 0 var(--hover)",
  //   }
  // }
}));

var userId_tmp;
var userName_tmp;

function Auth() {
  const clientId =
    process.env.GOOGLE_CLIENT_ID ||
    "315916359879-9hc3ac4snn53s7cma3rbfbotm84q6tfl.apps.googleusercontent.com";
  const history = useHistory();
  const classes = useStlyes();
  // const [showNoti,setShowNoti] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const [userName, setUserName] = useState("");
  const isDevEnv =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development";

  const onLoginSuccess = (userName) => {
    if (userName) {
      enqueueSnackbar(`Welcome ${userName} (${userId_tmp})`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(`logged in as ${userId_tmp}`, { variant: "success" });
    }
    setTimeout(function () {
      enqueueSnackbar(`Entering the game`);
    }, 1000);
    setTimeout(function () {
      history.push("/home");
    }, 3000);
  };
  // useEffect(()=>{
  //   console.log(userName)
  // },[userName])

  const mockUserId = () => {
    userId_tmp = Math.floor(100000 + Math.random() * 900000);
    window.sessionStorage.setItem("userId", userId_tmp);
  };

  const googleAuthen = (profile, googleUser) => {
    let user = {
      accessToken: profile.getId(),
      userName: profile.getName(),
      googleId: profile.getId(),
      googleToken: googleUser.accessToken,
    };
    console.log(user);
    axios
      .post(`http://localhost:10000/users`, user)
      .then((res) => {
        console.log("regis success", res.data);
      })
      .catch((err) => {
        axios
          .get(`http://localhost:10000/users`)
          .then((res) => {
            console.log("login", res.data);
          })
          .catch((err) => {});
      });
  };

  function onSignIn(googleUser) {
    console.log("success");
    var profile = googleUser.getBasicProfile();
    // console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log("Name: " + profile.getName());
    // console.log("Image URL: " + profile.getImageUrl());
    // console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    // console.log(googleUser);
    if (googleUser.accessToken) {
      // mockUserId()
      const userData = googleAuthen(profile, googleUser);
      // onLoginSuccess(profile.getName())
    }
  }

  function onDevSignIn() {
    mockUserId();
    onLoginSuccess();
  }

  // const handleClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setShowNoti(false);
  // };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{ width: "200px", height: "200px", marginBottom: "32px" }}
        />
        <Typography
          align="center"
          className={clsx(classes.title, classes.slide)}
        >
          Exploding Puppy
        </Typography>
        <GoogleLogin
          clientId={clientId}
          render={(renderProps) => (
            <Button
              className={classes.loginButton}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              Google Login
            </Button>
          )}
          buttonText="Login"
          onSuccess={onSignIn}
          onFailure={onSignIn}
          cookiePolicy={"single_host_origin"}
        />
        {isDevEnv && (
          <Button
            className={clsx(classes.loginButton)}
            onClick={() => onDevSignIn()}
          >
            dev login
          </Button>
        )}
      </div>
    </div>
  );
}
export default function Authen() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Auth />
    </SnackbarProvider>
  );
}
