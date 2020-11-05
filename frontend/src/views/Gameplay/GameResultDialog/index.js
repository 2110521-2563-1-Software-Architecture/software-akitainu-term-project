import React, { useState, useEffect } from "react";
import "./GameResultDialog.css";
import TransitionsModal from "../../../components/TransitionsModal";
import Button from "../../../components/Button";
import { Avatar } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
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
  let userRank = 0;
  result.map((user, idx) => {
    if (userId === user.userId) userRank = idx + 1;
  });

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

  const [showEXPResultModal, setShowEXPResultModal] = useState(false);

  const onClickGameResultOKButton = () => {
    setShowEXPResultModal(true);
  };

  const BorderLinearProgress = withStyles((theme) => ({
    root: {
      width: 150,
      height: 12,
      borderRadius: 100,
    },
    colorPrimary: {
      backgroundColor:
        theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#1a90ff",
    },
  }))(LinearProgress);

  const mockData = {
    exp: 0,
    plusExp: 500,
    level: 20,
    rank: 41,
    plusRank: 2,
  };

  const { exp, plusExp, level, rank, plusRank } = props;
  const [curExp, setCurExp] = useState(exp);
  const [curPlusExp, setCurPlusExp] = useState(plusExp);
  const updateTimes = 100;
  const plusExpPerTime = plusExp / updateTimes;

  const [curLevel, setCurLevel] = useState(level);

  const getMaxExp = (level) => 100 + level * level * 5;

  useEffect(() => {
    if (!showEXPResultModal) return;
    const timer = setInterval(() => {
      if (curPlusExp <= 0) return; // done
      if (curExp + plusExpPerTime < getMaxExp(curLevel)) {
        // normally
        setCurExp(curExp + plusExpPerTime);
        setCurPlusExp(curPlusExp - plusExpPerTime);
      } else {
        // level up
        setCurPlusExp(curPlusExp - (getMaxExp(curLevel) - curExp));
        setCurExp(0);
        setCurLevel(curLevel + 1);
      }
    }, 7);
    if (level > curLevel) {
      setCurExp(exp);
      setCurLevel(level);
    }
    return () => {
      clearInterval(timer);
    };
  });

  const getRankText = (rank) => {
    if (!plusRank) return null;
    const nextRank = rank + plusRank;
    if (rank === nextRank) return <span className="rankText">{rank}</span>;
    if (rank < nextRank)
      return (
        <span className="rankText">
          {rank} {"→"} <span className="greaterNextRank">{nextRank}</span>
        </span>
      );
    return (
      <span className="rankText">
        {rank} {"→"} <span className="lessNextRank">{nextRank}</span>
      </span>
    );
  };
  const rankText = getRankText(rank);
  return (
    <>
      <TransitionsModal
        open={true || (open && !showEXPResultModal)}
        showCloseButton={false}
      >
        <div className="modal">
          <div className="title">You are {userRankText}</div>
          <div className="playerList">
            {result.map(({ userId, userName, profileImgUrl }, idx) => {
              if (idx !== userRank - 1)
                // other player
                return (
                  <div className="avatarAndUserName">
                    <Avatar
                      className={classes.avatar}
                      alt={userName}
                      src={profileImgUrl}
                    />
                    <span className="userName">{userName}</span>
                  </div>
                );
              return (
                // player
                <div className="avatarAndUserName">
                  <Avatar
                    className={classes.userAvatar}
                    alt={userName}
                    src={profileImgUrl}
                  />
                  <span className="userUserName">{userName}</span>
                </div>
              );
            })}
          </div>
          <Button text={"OK"} onClick={onClickGameResultOKButton} />
        </div>
      </TransitionsModal>
      <TransitionsModal open={showEXPResultModal} showCloseButton={false}>
        <div className="modal">
          <div className="title">Result</div>
          <div className="title resultBody">
            <span>Level</span>
            <span className="levelText">{curLevel}</span>
            <div className="progressAndEXPText">
              <BorderLinearProgress
                variant="determinate"
                value={(curExp / getMaxExp(curLevel)) * 100}
              />
              <span className="expText">
                {Math.floor((curExp / getMaxExp(curLevel)) * 100)} %
              </span>
            </div>
            {plusRank && <span>Rank</span>}
            {rankText}
            <div className="dummyDiv" />
          </div>
          <Button text={"Main Menu"} onClick={goToMainMenu} />
        </div>
      </TransitionsModal>
    </>
  );
}
