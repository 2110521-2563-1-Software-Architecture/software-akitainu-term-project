import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Chat from "./Chat";
import Game from "./Game";
import { Palette } from "components";
import socketIOClient from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    background: Palette.yellow100,
  },
  navbarTop: {
    height: "64px",
    background: Palette.blue300,
    width: "100vw",
  },
  welcome: {
    color: Palette.blue300,
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
    background: Palette.green400,
    cursor: "pointer",
    borderRadius: "18px",
    color: "white",
  },
}));

function Gameplay() {
  const classes = useStyles();
  const { roomId } = useParams();
  const history = useHistory();

  const ENDPOINT = "localhost:10001";
  const socket = socketIOClient(ENDPOINT);

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
      <Chat roomId={roomId} />
      <Game socket={socket} />
    </div>
  );
}

export default Gameplay;
