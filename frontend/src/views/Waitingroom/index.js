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
    marginTop: "20%",
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
  }
}));

function Waitingroom(props) {
  const classes = useStyles();
  const [maxPlayer, setMaxplayer] = useState(3);
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
  const { roomId } = useParams();

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

  const handleCloseSeting = () => {
    setSettingOpen(false);
  };

  useEffect(() => {
    const {matchmakingSocket} = props;
    
  })

  const handleStart = () => {
    const {matchmakingSocket} = props;
    matchmakingSocket.emit("start-custom-room", {inviteId: roomId});
  }

  return (
    <>
      <Grid container className={classes.root}>
        <Grid container item xs={3} className={classes.settingcontainer}>
          <Grid item xs={12} className={classes.settingsection}>
            <Typography
              className={classes.title}
              style={{ textAlign: "center", marginBottom: "10px" }}
            >
              Custom Setting
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  // checked={state.checkedB}
                  // onChange={handleChange}
                  name="checkedB"
                  color="primary"
                />
              }
              label={<Typography className={classes.title}>Public</Typography>}
              style={{ marginBottom: "10px" }}
            />
            <Typography
              className={classes.title}
              style={{ textAlign: "left", marginBottom: "10px" }}
            >
              Max Player
            </Typography>
            <Slider
              defaultValue={maxPlayer}
              valueLabelFormat={(n) => `${n}`}
              valueLabelDisplay="auto"
              step={1}
              min={3}
              max={8}
              style={{ marginBottom: "10px" }}
              onChangeCommitted={(e, idx) => setMaxplayer(idx)}
            />
            <Typography
              className={classes.title}
              style={{ textAlign: "left", marginBottom: "10px" }}
            >
              เวลาต่อ turn:
            </Typography>
            <Slider
              defaultValue={timeDelay}
              valueLabelFormat={(n) => `${n}`}
              valueLabelDisplay="auto"
              step={5}
              min={5}
              max={60}
              style={{ marginBottom: "30px" }}
              onChangeCommitted={(e, idx) => setTimeDelay(idx)}
            />
            <Typography
              className={classes.title}
              style={{ textAlign: "center", cursor: "pointer" }}
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
            <Grid container item xs={6}>
              <img className={classes.profilePic}></img>
              <Typography className={classes.playnametext}>Owen</Typography>
            </Grid>
            <Grid container item xs={6}>
              <img className={classes.profilePic}></img>
              <Typography className={classes.playnametext}>Miw</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Button text="Play" className={classes.startButton} onClick={handleStart} />
      </Grid>
      <SettingDialog
        open={settingOpen}
        handleClose={handleCloseSeting}
        NumberofCard={NumberofCard}
      />
    </>
  );
}
export default Waitingroom;
