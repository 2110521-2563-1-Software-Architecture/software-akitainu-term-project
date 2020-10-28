import React from "react";
import { makeStyles } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import { Palette } from "components";

const useStyles = makeStyles((theme) => ({
  navBarWrapper: {
    width: "100%",
    height: "64px",
    background: Palette.blue300,
    display: "flex",
    justifyContent: "center",
  },

  homeButton: {
    margin: "auto",
    marginLeft: "16px",
  },
  logoutButton: {
    margin: "auto 16px",
  },
}));

const NavBar = (props) => {
  const classes = useStyles();
  const history = useHistory();

  const backtoHome = () => {
    history.push("/home");
    history.go(0);
  };

  const onLogout = () => {
    sessionStorage.setItem("userId", null);
    backtoHome();
  };

  return (
    <div className={classes.navBarWrapper}>
      <Button
        onClick={backtoHome}
        variant="contained"
        color="secondary"
        className={classes.homeButton}
      >
        Home
      </Button>
      <Button
        onClick={onLogout}
        variant="contained"
        color="secondary"
        className={classes.logoutButton}
      >
        Logout
      </Button>
    </div>
  );
};

export default NavBar;
