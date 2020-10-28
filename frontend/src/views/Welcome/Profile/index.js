import React, { useState, useEffect } from "react";
import { Grid, Typography, Dialog, makeStyles } from "@material-ui/core";
import profileBox from "./components/profileBox.svg";
import ProfileDialog from "./ProfileDialog";

const useStyles = makeStyles((theme) => ({
  root: {
    // background:"yellow",
    height: "100%",
    cursor: "pointer",
    // background: `url(${profileBox})  no-repeat` ,
  },
  profileImage: {
    borderRadius: "100%",
    width: "100px",
  },
  profileText: {
    fontFamily: "Kanit",
    // fontWeight:600,
    fontSize: "24px",
  },
  rectDecor1: {
    position: "fixed",
    background: "#FF9AC5",
    width: "56px",
    height: "24px",
    border: "4px solid black",
    borderRadius: "16px",
    left: "20px",
    top: "8%",
  },
  rectDecor2: {
    position: "fixed",
    background: "#FF9AC5",
    width: "56px",
    height: "24px",
    border: "4px solid black",
    borderRadius: "16px",
    left: "20px",
    top: "12%",
  },
}));

function Profile() {
  const classes = useStyles();
  // const imgSrc = sessionStorage.getItem("profileImgUrl")
  // const userName = sessionStorage.getItem("userName")
  // const userRank = sessionStorage.getItem("userRank")
  // const userLevel = sessionStorage.getItem("userLevel")
  const profileResouce = {
    imgSrc: sessionStorage.getItem("profileImgUrl"),
    userName: sessionStorage.getItem("userName"),
    userRank: sessionStorage.getItem("userRank"),
    userLevel: sessionStorage.getItem("userLevel"),
  };
  const [openProfile, setOpenProfile] = useState(false);

  const handleCloseDialog = (e) => {
    setOpenProfile(false);
  };

  useEffect(() => {
    console.log(openProfile);
  }, [openProfile]);

  const handleOpenDialog = (e) => {
    setOpenProfile(true);
  };

  return (
    <Grid className={classes.root} container>
      <Grid
        container
        item
        xs={1}
        alignItems="center"
        direction="column"
        justify="center"
      >
        <Grid className={classes.rectDecor1}></Grid>
        <Grid className={classes.rectDecor2}></Grid>
      </Grid>
      <Grid
        container
        item
        xs={4}
        alignItems="center"
        justify="center"
        onClick={handleOpenDialog}
      >
        <img
          className={classes.profileImage}
          src={profileResouce.imgSrc}
          alt="alternatetext"
        />
      </Grid>
      <Grid
        container
        item
        xs={7}
        direction="column"
        justify="center"
        onClick={handleOpenDialog}
      >
        <Typography className={classes.profileText}>
          {profileResouce.userName}
        </Typography>
        <Typography
          className={classes.profileText}
        >{`Rank ${profileResouce.userRank}`}</Typography>
        <Typography
          className={classes.profileText}
        >{`Level ${profileResouce.userLevel}`}</Typography>
      </Grid>
      <ProfileDialog
        open={openProfile}
        handleClose={handleCloseDialog}
        profileResouce={profileResouce}
      />
    </Grid>
  );
}

export default Profile;
