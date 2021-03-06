import React, { useState } from "react";
import { makeStyles, Grid, Typography, Dialog } from "@material-ui/core";
import Button from "components/Button";
import CloseIcon from "@material-ui/icons/Close";

const usestyle = makeStyles((theme) => ({
  root: {
    height: "600px",
    backgroundColor: "#465A74",
    padding: "30px",
    display: "flex",
    justifyContent: "center",
  },
  Button: {
    // height: "128px",
    // maxHeight: "128px",
    padding: "50px 0px 50px 0px",
    position: "center",
  },
  text: {
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
  codeInput: {
    color: "white",
    fontFamily: "Roboto",
    fontSize: "48px",
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
    textAlign: "center",
    width: "75%",
    marginBottom: "40px",
    outline: "none",
    borderRadius: "16px",
    background: "lightgray",
    height: "50%",
  },
  errorText: {
    marginLeft: "10px",
    fontSize: "24px",
    display: "flex",
    alignItems: "center",
    color: "red",
    fontWeight: "bold",
    background: "rgba(0,0,0,0.25)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "12px",
  },
  codeInputAndErrorText: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function CustomDialog(props) {
  const classes = usestyle();
  const {
    open,
    onClose,
    onClickCreateButton,
    onClickJoinButton,
    isLoadingCustomRoom,
    joinCustomErrorText,
  } = props;

  const [inputCode, setInputCode] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  const handleClose = () => {
    setInviteCode("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={"lg"}>
      <Grid container className={classes.root}>
        <CloseIcon
          style={{
            position: "absolute",
            top: "16px",
            right: "24px",
            width: "30px",
            height: "30px",
            color: "#FFF",
            cursor: "pointer",
          }}
          onClick={handleClose}
        ></CloseIcon>
        <Grid item container style={{ justifyContent: "center" }}>
          <Typography
            className={classes.text}
            style={{
              fontSize: "48px",
            }}
          >
            {inputCode ? "Enter invite code" : "Custom Mode"}
          </Typography>
        </Grid>
        {inputCode ? (
          <>
            <div className={classes.codeInputAndErrorText}>
              <input
                className={classes.codeInput}
                defaultValue={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              {joinCustomErrorText && (
                <div className={classes.errorText}>{joinCustomErrorText}</div>
              )}
            </div>
            <Grid
              item
              container
              direction="row"
              style={{ justifyContent: "center" }}
            >
              <Grid item xs="2">
                <Button
                  text={isLoadingCustomRoom ? "Loading..." : "Join room"}
                  className={classes.Button}
                  style="primary"
                  onClick={() => onClickJoinButton(inviteCode)}
                  disabled={isLoadingCustomRoom}
                />
              </Grid>
              <Grid item xs="2" style={{ marginLeft: "100px" }}>
                <Button
                  text={isLoadingCustomRoom ? "Loading..." : "Back"}
                  className={classes.Button}
                  style="secondary"
                  onClick={() => {
                    setInputCode(false);
                    setInviteCode("");
                  }}
                  disabled={isLoadingCustomRoom}
                />
              </Grid>
            </Grid>
          </>
        ) : (
          <Grid
            item
            container
            direction="row"
            style={{ justifyContent: "center" }}
          >
            <Grid item xs="2">
              <Button
                text={isLoadingCustomRoom ? "Loading..." : "Create Room"}
                className={classes.Button}
                style="primary"
                onClick={onClickCreateButton}
                disabled={isLoadingCustomRoom}
              />
            </Grid>
            <Grid item xs="2" style={{ marginLeft: "100px" }}>
              <Button
                text="Join Room"
                className={classes.Button}
                style="secondary"
                onClick={() => {
                  setInputCode(true);
                  setInviteCode("");
                }}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Dialog>
  );
}

export default CustomDialog;
