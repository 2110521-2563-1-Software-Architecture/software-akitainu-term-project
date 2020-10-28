import React from "react";
import { Grid, makeStyles, Avatar } from "@material-ui/core";
import card_back from "../../../image/card_back.png";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "90%",
    height: "90%",
    backgroundColor: "rgba(182,197,224,0.3)",
    borderRadius: "16px",
    padding: "8px",
  },
  rootClickable: {
    position: "relative",
    zIndex: "101",
    "&:hover": { boxShadow: "0px 0px 10px 4px rgba(255,255,255,0.75)" },
    cursor: "pointer",
  },
  rootCurrentTurn: {
    boxShadow: "0px 0px 10px 4px rgba(100,60,77,0.75)",
  },
  cardsection: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
  },
  cardcontainer: {
    width: "100%",
    height: "60%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  playerName: {
    width: "calc(100% - 40px)",
    margin: "auto",
    paddingLeft: "10px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    fontFamily: "Roboto",
    fontSize: "120%",
    color: "white",
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
  playerNameCurrentTurn: {
    color: "#FF9AC5",
  },
  dead: {
    fontSize: "140%",
    color: "red",
    textAlign: "center",
  },
  cardList: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  listItem: {
    listStyle: "none",
    height: "100%",
    width: "6%",
    margin: "auto",
    display: "flex",
    alignItems: "center",
  },
  nameAndAvatar: {
    width: "100%",
    height: "40px",
    display: "flex",
  },
}));

const getNthCardStyle = (n) => ({
  position: "relative",
  zIndex: `${n + 1}`,
  height: "60%",
  boxShadow:
    // equal to theme.shadows[5]
    "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)",
  borderRadius: "4px",
});

function Otherhand(props) {
  const classes = useStyles();
  const { user, clickable, nextUserId, onClick } = props;
  const name = user.userName ? user.userName : `Player ${user.userId}`;
  const numberOfCards = user.numberOfCards;
  const isDead = user.isDead;
  const currentTurn = nextUserId === user.userId;
  function gencard(numberofcards) {
    let tmp = Array();
    if (numberOfCards <= 10) {
      for (let i = 0; i < numberofcards; i++) {
        tmp.push(
          <li
            className={classes.listItem}
            style={
              i === numberOfCards - 1 ? { width: "fit-content" } : undefined
            }
          >
            <img src={card_back} style={getNthCardStyle(i)} />
          </li>
        );
      }
    } else {
      tmp.push(
        <li
          className={classes.listItem}
          style={{ width: "fit-content", margin: "0" }}
        >
          <img src={card_back} style={getNthCardStyle(0)} />
        </li>
      );
      tmp.push(
        <li
          className={classes.listItem}
          style={{ width: "fit-content", margin: "0" }}
        >
          <div
            className={classes.playerName}
            style={{ margin: "0", overflow: "unset" }}
          >{`x ${numberOfCards}`}</div>
        </li>
      );
    }
    return tmp;
  }

  return (
    <Grid
      container
      direction="row"
      className={classNames(
        classes.root,
        { [classes.rootClickable]: clickable },
        { [classes.rootCurrentTurn]: currentTurn }
      )}
      onClick={onClick}
    >
      <Grid container item xs="12" className={classes.nameAndAvatar}>
        <Avatar alt={name} src="/broken-image.jpg"></Avatar>
        <Grid
          item
          className={classNames(classes.playerName, {
            [classes.playerNameCurrentTurn]: currentTurn,
          })}
        >
          {name}
        </Grid>
      </Grid>
      {isDead ? (
        <div className={classNames(classes.playerName, classes.dead)}>DEAD</div>
      ) : (
        <div className={classes.cardcontainer}>
          <ui className={classes.cardList}>{gencard(numberOfCards)}</ui>
        </div>
      )}
    </Grid>
  );
}

export default Otherhand;
