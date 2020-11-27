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
  leaderboardBtn: {
    top: "30px",
    right: "30px",
    position: "absolute",
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
      isLoadingCustomRoom: false,
      time: 0,
      publicCustomRooms: {},
      joinCustomErrorText: "",
      isRankFound: false,
    };
  }

  // data = ['123','456']
  setRankFound = () => {
    this.setState({ isRankFound: true });
    console.log("setState");
  };

  componentDidMount() {
    const { matchmakingSocket } = this.state;
    matchmakingSocket.emit("get-custom-game-rooms", {
      userId: sessionStorage.getItem("userId"),
    });
    matchmakingSocket.on("duplicate-user", (data) => {
      console.log("duplicate-user");
      alert("Error: This user is already in the system!");
      // using onLogout() results in an error
      sessionStorage.setItem("userId", null);
      sessionStorage.setItem("userName", null);
      sessionStorage.setItem("profileImgUrl", null);
      window.location = `/login`;
    });
    matchmakingSocket.on("ranked-found", (data) => {
      console.log("ranked-found");
      // console.log(data);
      window.location = `/gameplay/${data.roomId}`;
      this.setRankFound();
    });
    matchmakingSocket.on("custom-room-id", (data) => {
      console.log(data);
      window.location = `/waiting/${data.roomId}`;
      // redirect to waiting room for that room id
    });
    matchmakingSocket.on("update-custom-rooms", (data) => {
      this.setState({ publicCustomRooms: data });
    });
    matchmakingSocket.on("join-custom-error", (data) => {
      this.setState({
        isLoadingCustomRoom: false,
        joinCustomErrorText: data.msg,
      });
    });
  }

  onLogout = () => {
    const history = useHistory();
    sessionStorage.setItem("userId", null);
    sessionStorage.setItem("userName", null);
    sessionStorage.setItem("profileImgUrl", null);
    history.push("/home");
    history.go(0);
  };

  handleClickPlayButton = () => {
    console.log("click");
    this.setState({ openModeDialog: true });
  };

  handleClickCustomButton = () => {
    // console.log("click");
    this.setState({ openCustomDialog: true });
  };

  handleClickCreateButton = () => {
    this.setState({ isLoadingCustomRoom: true });
    const { matchmakingSocket } = this.state;
    const userId = sessionStorage.getItem("userId");
    matchmakingSocket.emit("create-custom-room", { userId });
  };

  handleClickJoinButton = (inviteCode) => {
    this.setState({ isLoadingCustomRoom: true });
    const { matchmakingSocket } = this.state;
    const userId = sessionStorage.getItem("userId");
    matchmakingSocket.emit("join-custom-room", {
      userId,
      inviteId: inviteCode,
    });
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
    this.setState({ openCustomDialog: false, joinCustomErrorText: "" });
  };

  closeRankDialog = () => {
    const { matchmakingSocket } = this.state;
    const userId = sessionStorage.getItem("userId");
    matchmakingSocket.emit("quit-search-ranked", { userId });
    this.setState({ openRankDialog: false, isRankFound: false });
  };

  settime = (time) => {
    this.setState({ time });
  };

  toLeaderboard = () => {
    window.location = "/leaderboard";
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
      isLoadingCustomRoom,
      publicCustomRooms,
      joinCustomErrorText,
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
            <CustomRoomList
              publicCustomRooms={publicCustomRooms}
              onClickRoom={this.handleClickJoinButton}
            />
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
        <div className={classes.leaderboardBtn}>
          <Button onClick={this.toLeaderboard} text="Leader Board" />
        </div>
        <ModeDialog
          open={openModeDialog}
          onClose={this.closeModeDialog}
          customButton={this.handleClickCustomButton}
          rankButton={this.handleClickRankButton}
        />
        <CustomDialog
          open={openCustomDialog}
          onClose={this.closeCustomDialog}
          onClickCreateButton={this.handleClickCreateButton}
          onClickJoinButton={this.handleClickJoinButton}
          isLoadingCustomRoom={isLoadingCustomRoom}
          joinCustomErrorText={joinCustomErrorText}
        />
        <RankDialog
          open={openRankDialog}
          onClose={this.closeRankDialog}
          time={time}
          settime={this.settime}
          isFound={this.state.isRankFound}
        />
      </Grid>
    );
  }
}

export default withStyles(usestyle)(Welcome);
