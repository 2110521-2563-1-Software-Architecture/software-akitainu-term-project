import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  withStyles,
  makeStyles,
  Grid,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  TextField,
  IconButton,
  InputAdornment,
  Box,
  Switch,
  FormControlLabel,
  Slider,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
import SettingDialog from "./SettingDialog";
import Button from "components/Button";
import exit from "../../image/exit.png";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#465A74",
    padding: "20px 50px 20px 50px",
  },
  settingcontainer: {
    height: "100%",
    // backgroundColor: "green",
    // padding: "20px 100px 20px 50px",
    marginRight: "50px",
  },
  settingsection: {
    height: "80%",
    backgroundColor: "#B6C5E0",
    padding: "20px 50px 20px 50px",
    marginTop: "30%",
    border: "1px solid black",
    borderRadius: "20px",
  },
  playercontainer: {
    height: "100%",
    // backgroundColor: "blue",
  },
  blanksection: {
    height: "10%",
    // backgroundColor: "green",
    padding: "20px 50px 20px 50px",
  },
  codesection: {
    height: "20%",
    backgroundColor: "#FF6D9F",
    padding: "20px 50px 20px 50px",
    border: "1px solid black",
    borderRadius: "20px",
    width: "90%",
  },
  playersection: {
    height: "70%",
    backgroundColor: "#B6C5E0",
    padding: "20px 50px 20px 50px",
    marginTop: "5%",
    border: "1px solid black",
    borderRadius: "20px",
    width: "90%",
  },
  title: {
    fontWeight: "bold",
    fontSize: "36px",
    color: "white",
    fontFamily: "Roboto",
    textShadow:
      "2px 0 0 black, \
      -2px 0 0 black, \
      0 2px 0 black, \
      0 -2px 0 black, \
      1px 1px 0 black, \
      -1px -1px 0 black, \
      1px -1px 0 black, \
      -1px 1px 0 black, \
      1px 1px 5px black;",
  },
  profilePic: {
    height: "10%",
    width: "10%",
    border: "1px solid black",
    borderRadius: "100%",
    marginRight: "20%",
  },
  playnametext: {
    fontWeight: "bold",
    fontSize: "36px",
    color: "black",
    fontFamily: "Roboto",
    // textShadow:
    //   "2px 0 0 white, \
    //   -2px 0 0 white, \
    //   0 2px 0 white, \
    //   0 -2px 0 white, \
    //   1px 1px 0 white, \
    //   -1px -1px 0 white, \
    //   1px -1px 0 white, \
    //   -1px 1px 0 white, \
    //   1px 1px 5px white;",
  },
  textheader: {
    fontWeight: "bold",
    color: "white",
    fontFamily: "Roboto",
    fontSize: "24px",
    textShadow:
      "2px 0 0 black, \
      -2px 0 0 black, \
      0 2px 0 black, \
      0 -2px 0 black, \
      1px 1px 0 black, \
      -1px -1px 0 black, \
      1px -1px 0 black, \
      -1px 1px 0 black, \
      1px 1px 5px black;",
  },
  startButton: {
    height: "8%",
    width: "4%",
    position: "absolute",
    right: "3%",
    bottom: "5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  exitButton: {
    position: "absolute",
    width: "3.5%",
    padding: "8px",
  },
}));

const ENDPOINT = process.env.REACT_APP_BACKEND_API || "http://localhost:10000";

function Waitingroom(props) {
  const classes = useStyles();
  const [maxPlayer, setMaxplayer] = useState(8);
  const [timeDelay, setTimeDelay] = useState(30);
  const [defuse, setDefuse] = useState(5);
  const [nope, setNope] = useState(5);
  const [attack, setAttack] = useState(5);
  const [skip, setSkip] = useState(5);
  const [favor, setFavor] = useState(5);
  const [seeTheFuture, setSeeTheFuture] = useState(5);
  const [shuffle, setShuffle] = useState(5);
  const [common1, setCommon1] = useState(5);
  const [common2, setCommon2] = useState(5);
  const [common3, setCommon3] = useState(5);
  const [common4, setCommon4] = useState(5);
  const [common5, setCommon5] = useState(5);
  const [settingOpen, setSettingOpen] = useState(false);
  const [leader, setLeader] = useState("");
  const [isPublic, setPublic] = useState(false);
  const [players, setPlayers] = useState([]);
  const [playersName, setPlayersName] = useState([]);
  const { roomId } = useParams();

  const userId = sessionStorage.getItem("userId");
  const isLeader = userId === leader;

  const NumberofCard = [
    {
      Numbercard: defuse,
      setcard: setDefuse,
    },
    {
      Numbercard: nope,
      setcard: setNope,
    },
    {
      Numbercard: attack,
      setcard: setAttack,
    },
    {
      Numbercard: skip,
      setcard: setSkip,
    },
    {
      Numbercard: favor,
      setcard: setFavor,
    },
    {
      Numbercard: seeTheFuture,
      setcard: setSeeTheFuture,
    },
    {
      Numbercard: shuffle,
      setcard: setShuffle,
    },
    {
      Numbercard: common1,
      setcard: setCommon1,
    },
    {
      Numbercard: common2,
      setcard: setCommon2,
    },
    {
      Numbercard: common3,
      setcard: setCommon3,
    },
    {
      Numbercard: common4,
      setcard: setCommon4,
    },
    {
      Numbercard: common5,
      setcard: setCommon5,
    },
  ];

  const handleClickSetting = () => {
    setSettingOpen(true);
  };

  const checkNumberOfCards = () => {
    const numberOfCards =
      defuse +
      nope +
      attack +
      skip +
      favor +
      shuffle +
      seeTheFuture +
      common1 +
      common2 +
      common3 +
      common4 +
      common5;
    if (numberOfCards < players.length * 7) return false;
    return true;
  };

  const handleCloseSetting = () => {
    if (!checkNumberOfCards()) {
      alert(`Please select more than or equal ${players.length * 7} cards`);
      return false;
    }
    const { matchmakingSocket } = props;

    setSettingOpen(false);
    if (isLeader) {
      matchmakingSocket.emit("set-cards", {
        inviteId: roomId,
        cards: {
          defuse,
          nope,
          attack,
          skip,
          favor,
          shuffle,
          seeTheFuture,
          common1,
          common2,
          common3,
          common4,
          common5,
        },
      });
    }
  };

  useEffect(() => {
    const { matchmakingSocket } = props;
    const userId = sessionStorage.getItem("userId");
    matchmakingSocket.emit("joined-custom-room", { inviteId: roomId, userId });
    matchmakingSocket.on("custom-room-info", async (data) => {
      const { leader, players, options } = data;
      const {
        defuse,
        nope,
        attack,
        skip,
        favor,
        shuffle,
        seeTheFuture,
        common1,
        common2,
        common3,
        common4,
        common5,
        maxPlayer,
        isPublic,
        timePerTurn,
      } = options;

      setDefuse(defuse);
      setNope(nope);
      setAttack(attack);
      setSkip(skip);
      setFavor(favor);
      setShuffle(shuffle);
      setSeeTheFuture(seeTheFuture);
      setCommon1(common1);
      setCommon2(common2);
      setCommon3(common3);
      setCommon4(common4);
      setCommon5(common5);
      setPublic(isPublic);
      setMaxplayer(maxPlayer);
      setTimeDelay(timePerTurn);
      setLeader(leader);
      setPlayers(players);

      const newUserName = await players.map(async (player) => {
        const resp = await axios.get(`${ENDPOINT}/users/username/${player}`);
        return resp.data;
      });
      Promise.all(newUserName).then((usersName) => {
        setPlayersName(usersName);
      });
    });
    matchmakingSocket.on("custom-room-info-error", () => {
      window.location = `/home`;
    });
    matchmakingSocket.on("leave-custom-room", (data) => {
      window.location = `/home`;
    });
    matchmakingSocket.on("started-custom-room", (data) => {
      window.location = `/gameplay/${data.roomId}`;
    });
  }, []);

  const handleStart = () => {
    if (!checkNumberOfCards()) {
      alert(`Please select more than or equal ${players.length * 7} cards`);
      return false;
    }

    const { matchmakingSocket } = props;
    matchmakingSocket.emit("start-custom-room", { inviteId: roomId });
  };

  const handleSwitchChange = () => {
    const { matchmakingSocket } = props;
    matchmakingSocket.emit("set-visible", {
      inviteId: roomId,
      visible: !isPublic,
    });
  };

  const handleMaxPlayerChange = (idx) => {
    const { matchmakingSocket } = props;
    matchmakingSocket.emit("set-max-player", {
      inviteId: roomId,
      maxPlayer: idx,
    });
  };

  const handleTimePerTurnChange = (idx) => {
    const { matchmakingSocket } = props;
    matchmakingSocket.emit("set-time-per-turn", {
      inviteId: roomId,
      timePerTurn: idx,
    });
  };

  const history = useHistory();
  const _handleExit = () => {
    history.push("/home");
    history.go(0);
  };

  const leaderUser = (
    <Grid container item xs={6}>
      {/* <img className={classes.profilePic}></img> */}
      <Typography className={classes.playnametext}>{leader}</Typography>
    </Grid>
  );

  const playersUser = playersName.map((playerName) => (
    <Grid container item xs={6}>
      {/* <img className={classes.profilePic}></img> */}
      <Typography className={classes.playnametext}>{playerName}</Typography>
    </Grid>
  ));

  return (
    <>
      <Grid container className={classes.root}>
        <Grid container item xs={3} className={classes.settingcontainer}>
          <Grid item xs={12} className={classes.settingsection}>
            <Typography
              className={classes.title}
              style={{
                textAlign: "center",
                marginTop: "10px",
                fontSize: "28px",
              }}
            >
              Custom settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={handleSwitchChange}
                  name="checkedB"
                  color="primary"
                  disabled={!isLeader}
                />
              }
              label={
                <Typography
                  className={classes.title}
                  style={{ fontSize: "24px" }}
                >
                  {isPublic ? "Public" : "Private"}
                </Typography>
              }
              style={{ margin: "16px auto" }}
            />
            <Typography
              className={classes.title}
              style={{
                textAlign: "left",
                marginBottom: "10px",
                fontSize: "24px",
              }}
            >
              {`Max player: ${maxPlayer}`}
            </Typography>
            <Slider
              defaultValue={maxPlayer}
              value={maxPlayer}
              valueLabelFormat={(n) => `${n}`}
              valueLabelDisplay="auto"
              step={1}
              min={2}
              max={8}
              style={{ marginBottom: "10px" }}
              onChangeCommitted={(e, idx) => handleMaxPlayerChange(idx)}
              disabled={!isLeader}
            />
            <Typography
              className={classes.title}
              style={{
                textAlign: "left",
                marginBottom: "10px",
                fontSize: "24px",
              }}
            >
              {`Time per turn: ${timeDelay}`}
            </Typography>
            <Slider
              defaultValue={timeDelay}
              value={timeDelay}
              valueLabelFormat={(n) => `${n}`}
              valueLabelDisplay="auto"
              step={5}
              min={5}
              max={60}
              style={{ marginBottom: "30px" }}
              onChangeCommitted={(e, idx) => handleTimePerTurnChange(idx)}
              disabled={!isLeader}
            />
            <Typography
              className={classes.title}
              style={{
                textAlign: "center",
                cursor: "pointer",
                fontSize: "24px",
              }}
              onClick={handleClickSetting}
            >
              Card Setting
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs={8} className={classes.playercontainer}>
          <Grid
            container
            item
            xs={12}
            className={classes.codesection}
            alignContent="center"
            justify="center"
          >
            <Grid item xs={6}>
              <Typography className={classes.title}>Code :</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography className={classes.title}>{roomId}</Typography>
            </Grid>
          </Grid>
          <Grid container item xs={12} className={classes.playersection}>
            {playersUser}
          </Grid>
        </Grid>
        {leader === userId && (
          <Button
            text="Play"
            className={classes.startButton}
            onClick={handleStart}
          />
        )}
        <Button
          text={"Exit"}
          icon={exit}
          iconPosition={"top"}
          onClick={_handleExit}
          style={"secondary"}
          className={classes.exitButton}
        />
      </Grid>
      <SettingDialog
        open={settingOpen}
        isLeader={isLeader}
        maxPlayer={maxPlayer}
        handleClose={handleCloseSetting}
        NumberofCard={NumberofCard}
      />
    </>
  );
}
export default Waitingroom;
