import React, { useRef, useEffect, useState, useMemo } from "react";
import {
  Dialog,
  Slide,
  Grid,
  makeStyles,
  Typography,
  IconButton,
  InputBase,
  ClickAwayListener,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import { ShibaFoot, LogoutIcon } from "./components/icon";
import { useHistory } from "react-router-dom";
import { isElement } from "react-dom/test-utils";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import avatarBoy from 'image/avatar-boy.svg'
import clsx from 'clsx'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    // "& .MuiDialog-paper" : {
    //   background:"red",
    // }
  },
  container: {
    background: "#465A74",
    borderRadius: "16px",
    display:"flex",
    flexDirection:"column",
    // alignContent:"center",
    // width:"800px",
  },
  detailImage: {
    borderRadius: "100%",
    // borderRadius:"16px",
    width: "200px",
  },
  detailContent: {
    // minWidth: "180px",
    background: "#B6C5E0",
    margin: "0px 32px 16px 16px",
    padding: "16px 16px 16px 16px",
    borderRadius: "16px",
    border: "3px solid black",
    display: "flex",
    flexDirection: "column",
    // maxHeight:"100px",
  },
  detailText: {
    fontFamily: "Kanit",
    fontSize: "32px",
    lineHeight: "48px",
    transition: "all 0.2s ease-in-out",
  },
  dialogPaper: {
    background: "none",
    maxWidth: "1800px",
  },
  title: {
    fontFamily: "Kanit",
    fontSize: "48px",
    // lineHeight:"80px",
    color: "white",
    margin: "16px auto 0px 297px",
  },
  editButton: {
    padding: "8px",
    // marginLeft:"256px",
    height: "48px",
    width: "48px",
  },
  logoutIcon : {
    color:"white",
    fontSize:"32px",
  },
  contentResponsive : {
    display:"flex",
    flexDirection:"column",
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",

  }
}));

function ProfileDialog({ open, handleClose, profileResouce }) {
  const classes = useStyles();
  const offsetTitle = useRef(0);
  const [footColor, setFootColor] = useState("#000000");
  const history = useHistory();
  const [nameEditing, setNameEditing] = useState(false);
  const [userName, setUsername] = useState(profileResouce.userName);

  const onLogout = () => {
    sessionStorage.clear();
    history.push("/home");
    history.go(0);
  };

  useEffect(() => {}, []);

  const handleChangeName = (name) => {
    setUsername(name);
    sessionStorage.setItem("userName", name);
  };

  const Title = () => (
    <Grid>
      <Typography className={classes.title}>Profile</Typography>
    </Grid>
  );

  const randomColor = () => {
    let color =
      "#" + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
    setFootColor(color);
  };

  const ProfileImage = React.memo(() => (
    <img
      className={classes.detailImage}
      src={avatarBoy}
      alt="alternatetext"
    />
  ));

  const isListenClickAway = () => {
    return nameEditing ? "onClick" : false;
  };

  const detail = () => (
    <Grid container>
      <Grid className={classes.contentResponsive} style={{ padding: "16px 32px 32px 32px", marginTop: "16px" }}>
        <ProfileImage />
      </Grid>
      <Grid className={clsx(classes.detailContent,classes.contentResponsive)} >
        <Grid container>
          <Typography className={classes.detailText}>Name : </Typography>
          <ClickAwayListener
            onClickAway={() => {
              setNameEditing(false);
              console.log("click");
            }}
            mouseEvent={isListenClickAway()}
            touchEvent={false}
          >
            <InputBase
              className={classes.detailText}
              style={{ margin: "0px 0 0 8px" }}
              value={userName}
              disabled={!nameEditing}
              onChange={(e) => handleChangeName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") setNameEditing(false);
              }}
              onDoubleClick={() => setNameEditing(true)}
            ></InputBase>
          </ClickAwayListener>
          <IconButton
            className={classes.editButton}
            style={{ alignSelf: "flex-end" }}
            onClick={() => setNameEditing((status) => !status)}
          >
            <EditIcon style={{ fontSize: "32px" }} />
          </IconButton>
        </Grid>
        <Grid container>
          <Grid item xs={8}>
          <Typography
          className={classes.detailText}
        >{`Rank ${profileResouce.userRank}`}</Typography>
        <Typography
          className={classes.detailText}
        >{`Level ${profileResouce.userLevel}`}</Typography>
        <Typography
          className={classes.detailText}
        >{`Win rate ${profileResouce.userLevel}`}</Typography>
        <Typography
          className={classes.detailText}
        >{`Exp ${profileResouce.userLevel}`}</Typography>
          </Grid>
          <Grid item xs={4} style={{display:"flex"}}>
          <ShibaFoot
            style={{ alignSelf: "flex-end", fill: footColor, cursor: "pointer",margin:"0px 0 0 32px" }}
            onClick={randomColor}
        />
          </Grid>
        </Grid>
        {/* <ShibaFoot
          style={{ alignSelf: "flex-end", fill: footColor, cursor: "pointer", transform:"scale(0.8)" }}
          onClick={randomColor}
        /> */}
      </Grid>
    </Grid>
  );

  const Logout = () => (
    <Grid container style={{marginTop:"-32px"}}>
      <IconButton
        style={{ marginLeft: "32px", marginBottom: "16px" }}
        onClick={onLogout}
      >
        <ExitToAppIcon className={classes.logoutIcon}/>
      </IconButton>
      <Typography
        className={classes.detailText}
        onClick={onLogout}
        style={{
          marginTop: "4px",
          // marginLeft: "16px",
          fontSize:"24px",
          color: "white",
          cursor: "pointer",
        }}
      >{`Logout`}</Typography>
    </Grid>
  );

  const PaperProps = {
    paper: classes.dialogPaper,
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      className={classes.root}
      classes={PaperProps}
    >
      <Grid className={classes.container}>
        <Title />
        {detail()}
        <Logout />
      </Grid>
    </Dialog>
  );
}
export default ProfileDialog;
