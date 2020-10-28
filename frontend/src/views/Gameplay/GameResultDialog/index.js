import React from "react";
import "./GameResultDialog.css";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "../../../components/Button";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: "100px",
    height: "100px",
  },
  userAvatar: {
    width: "100px",
    height: "100px",
    border: "4px solid black",
  },
}));

export default function GameResultDialog(props) {
  const { result, userId } = props;
  const open = result.length > 0;
  const userRank = result.length - result.indexOf(userId);

  const userRankText =
    userRank === 1
      ? "1st rank"
      : userRank === 2
      ? "2nd rank"
      : userRank === 3
      ? "3rd rank"
      : userRank + "th rank";

  const classes = useStyles();

  const history = useHistory();
  const goToMainMenu = () => {
    history.push("/home");
    history.go(0);
  };
  return (
    <TransitionsModal open={open} showCloseButton={false}>
      <div className="modal">
        <div className="userRankText">You are {userRankText}</div>
        <div className="playerList">
          {result.map((userName, idx) => {
            if (idx !== userRank - 1)
              return (
                <div className="avatarAndUserName">
                  <Avatar
                    className={classes.avatar}
                    alt={userName}
                    src="/broken-image.jpg"
                  />
                  <span className="userName">{userName}</span>
                </div>
              );
            return (
              <div className="avatarAndUserName">
                <Avatar
                  className={classes.userAvatar}
                  alt={userName}
                  src="/broken-image.jpg"
                />
                <span className="userUserName">{userName}</span>
              </div>
            );
          })}
        </div>
        <Button text={"Main Menu"} onClick={goToMainMenu} />
      </div>
    </TransitionsModal>
  );
}
