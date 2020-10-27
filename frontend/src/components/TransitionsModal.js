import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  dialog: {
    width: "fit-content",
    height: "fit-content",
    backgroundColor: "#465A74",
    outline: "none",
    border: "solid 4px black",
    borderRadius: "16px",
    boxShadow: "10px 10px 4px rgba(0, 0, 0, 0.5)",
    padding: "16px",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[600],
    backgroundColor: "white",
    boxShadow: "0 0 8px 2px rgba(0, 0, 0, 0.5)",
    "&:hover": {
      color: theme.palette.grey[800],
      backgroundColor: "white",
    },
  },
}));

export default function TransitionsModal(props) {
  const classes = useStyles();
  const {
    children,
    open,
    handleClose,
    disableBackdropClick = true,
    disableEscapeKeyDown = true,
    showCloseButton = true,
  } = props;

  return (
    <Modal
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      <Fade in={open}>
        <>
          <div className={classes.dialog}>{children}</div>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          )}
        </>
      </Fade>
    </Modal>
  );
}
