import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Chat from "./Chat";
import Game from "./Game";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    background: "#0088ad",
  },
  navbarTop: {
    height: "64px",
    background: "#020017",
    width: "100vw",
  },
  welcome: {
    color: "white",
    fontSize: "88px",
    textAlign: "center",
    paddingTop: "40vh",
  },
  exitRoomButton: {
    height: "40px",
    width: "80px",
    position: "relative",
    top: "12px",
    left: "24px",
    background: "#0088ad",
    cursor: "pointer",
    borderRadius: "18px",
  },
}));

function Gameplay() {
  const classes = useStyles();
  const { roomId } = useParams();
  const history = useHistory();

  const backtoHome = () => {
    history.push("/home");
    history.go(0);
  };

  const Topbar = () => (
    <div className={classes.navbarTop}>
      <div className={classes.exitRoomButton} onClick={backtoHome}>
        <div style={{ textAlign: "center", position: "relative", top: "8px" }}>
          Home
        </div>
      </div>
    </div>
  );

  return (
    <div className={classes.root}>
      <Topbar />
      <Chat />
      <Game />
    </div>
  );
}

export default Gameplay;
