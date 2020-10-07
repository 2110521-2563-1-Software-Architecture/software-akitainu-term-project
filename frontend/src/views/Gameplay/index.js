import React from "react";
import { makeStyles } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Chat from "./Chat";
import Game from "./Game";
import NavBar from "../../components/NavBar";
import { Palette } from "components";
import socketIOClient from "socket.io-client";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    width: "100vw",
    maxWidth: "100%",
    background: Palette.yellow100,
  },
}));

function Gameplay() {
  const classes = useStyles();
  const { roomId } = useParams();

  const ENDPOINT = "localhost:10001";
  const socket = socketIOClient(ENDPOINT);

  return (
    <div className={classes.root}>
      <NavBar />
      <Chat roomId={roomId} />
      <Game socket={socket} />
    </div>
  );
}

export default Gameplay;
