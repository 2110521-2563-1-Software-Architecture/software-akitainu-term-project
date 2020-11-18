import React from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import logo from "../../shiba-inu.svg";
import { useHistory } from "react-router-dom";
import Button from "components/Button";
import ModeDialog from "./ModeDialog";
import CustomDialog from "./CustomDialog";
import RankDialog from "./RankCustom";
import Profile from "./Profile";
import CustomRoomList from "./CustomRoomList";

const usestyle = (theme) => ({
  root: {
    height: "100vh",
    backgroundColor: "#465A74",
    padding: "20px 50px 20px 50px",
  },
  profileSection: {
    height: "20vh",
    backgroundColor: "#B6C5E0",
    borderRadius: "16px",
    border: "4px solid black",
  },
  friendSection: {
    height: "60vh",
    marginTop: "50px",
  },
  mainSection: {
    height: "calc(100vh-40px)",
    // backgroundColor: "#B6C5E0",
    marginLeft: "50px",
  },
  playButton: {
    width: "128px",
    alignSelf: "center",
  },
  text: {
    fontSize: "72px",
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
});

class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      matchmakingSocket: props.matchmakingSocket,
      openModeDialog: false,
      openCustomDialog: false,
      openRankDialog: false,
      time: 0,
    };
  }

  componentDidMount() {
    const { matchmakingSocket } = this.state;
    matchmakingSocket.on("ranked-found", (data) => {
      console.log("ranked-found");
      console.log(data);
    });
  }

  joinRoom100001 = () => {
    // todo:
    // var userIdPlaceholder = Math.floor(100000 + Math.random() * 900000);
    // const userId = prompt("Please enter your user Id", userIdPlaceholder);
    // window.sessionStorage.setItem("userId", userId);
  };

  onLogout = () => {
    const history = useHistory();
    sessionStorage.setItem("userId", null);
    history.push("/home");
    history.go(0);
  };

  handleClickPlayButton = () => {
    console.log("click");
    this.setState({ openModeDialog: true });
  };

  handleClickCustomButton = () => {
    console.log("click");
    this.setState({ openCustomDialog: true });
  };

  handleClickRankButton = () => {
    // console.log("click");
    const { matchmakingSocket } = this.state;
    const userId = sessionStorage.getItem("userId");
    matchmakingSocket.emit("search-ranked", { userId });
    this.setState({ time: 0, openRankDialog: true });
  };

  closeModeDialog = () => {
    this.setState({ openModeDialog: false });
  };

  closeCustomDialog = () => {
    this.setState({ openCustomDialog: false });
  };

  closeRankDialog = () => {
    const { matchmakingSocket } = this.state;
    const userId = sessionStorage.getItem("userId");
    matchmakingSocket.emit("quit-search-ranked", { userId });
    this.setState({ openRankDialog: false });
  };

  settime = (time) => {
    this.setState({ time });
  };

  render() {
    // const userId = sessionStorage.getItem("userId");

    // const classes = usestyle();
    // const history = useHistory();
    const { classes } = this.props;
    const {
      openModeDialog,
      openCustomDialog,
      openRankDialog,
      time,
    } = this.state;
    // const [openModeDialog, setModeDialog] = useState(false);
    // const [openCustomDialog, setCustomDialog] = useState(false);
    // const [openRankDialog, setRankDialog] = useState(false);
    // const [time, settime] = useState(1);

    return (
      <Grid container direction="row" className={classes.root}>
        <Grid item container direction="row" xs="3">
          <Grid item xs="12" className={classes.profileSection}>
            {/* <Typography style={{ textAlign: "center" }}>Profile</Typography> */}
            <Profile />
          </Grid>
          <Grid item xs="12" className={classes.friendSection}>
            <CustomRoomList />
          </Grid>
        </Grid>
        <Grid item xs="5" className={classes.mainSection}>
          <Grid
            item
            container
            style={{ justifyContent: "center", paddingTop: "15vh" }}
          >
            <img src={logo} className="App-logo" alt="logo" />
          </Grid>
          <Typography
            className={classes.text}
            style={{
              textAlign: "center",
              // color: "#ffffff",
              // textShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
              // fontSize: "72px",
              marginTop: "5px",
            }}
          >
            Exploding puppy
          </Typography>
          <Grid
            container
            style={{ justifyContent: "center", marginTop: "50px" }}
          >
            <Button
              text="Play"
              className={classes.playButton}
              onClick={this.handleClickPlayButton}
            ></Button>
          </Grid>
        </Grid>
        <Grid item xs="3" className={classes.mainSection}>
          <Typography style={{ textAlign: "center" }}>Leader Board</Typography>
        </Grid>
        <ModeDialog
          open={openModeDialog}
          onClose={this.closeModeDialog}
          customButton={this.handleClickCustomButton}
          rankButton={this.handleClickRankButton}
        />
        <CustomDialog
          open={openCustomDialog}
          onClose={this.closeCustomDialog}
        />
        <RankDialog
          open={openRankDialog}
          onClose={this.closeRankDialog}
          time={time}
          settime={this.settime}
        />
      </Grid>
    );
  }
}

export default withStyles(usestyle)(Welcome);
