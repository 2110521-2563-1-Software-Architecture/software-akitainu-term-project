import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";

const useStyles = makeStyles((theme) => ({
  button: {
    padding: "16px",
    borderRadius: "8px",
    border: "solid 2px black",
    cursor: "pointer",
    boxShadow: "4px 4px 4px rgba(0, 0, 0, 0.5)",
  },
  disabledButton: {
    cursor: "not-allowed",
    backgroundColor: "#9E9E9E !important",
  },
  primaryButton: {
    backgroundColor: "#FF9AC5",
    "&:hover": {
      backgroundColor: "#FF6D9F",
    },
  },
  secondaryButton: {
    backgroundColor: "#B6C5E0",
    "&:hover": {
      backgroundColor: "#96AED9",
    },
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: "24px",
  },
  text: {
    textAlign: "center",
    fontFamily: "Roboto",
    fontSize: "24px",
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
}));

export default function Button(props) {
  const classes = useStyles();
  const {
    // icon to render on the button using <img>
    icon,
    // icon position (releted to text) in the button: "left" / "right" / "top" / "buttom"
    // undefined -> "left"
    iconPosition,
    // string
    text,
    // "primary" -> pink / "secondary" -> blue
    // undefined -> "primary"
    style,
    // onClick() function
    onClick,
    // determine if the button is disable
    disabled,
    // additional className, used for define size and/or override any style coded here
    className,
  } = props;
  let contentStyle, iconStyle;
  switch (iconPosition) {
    case "left":
      contentStyle = { flexDirection: "row" };
      iconStyle = { marginRight: "8px" };
      break;
    case "right":
      contentStyle = { flexDirection: "row-reverse" };
      iconStyle = { marginLeft: "8px" };
      break;
    case "top":
      contentStyle = { flexDirection: "column" };
      iconStyle = { marginBottom: "8px" };
      break;
    case "buttom":
      contentStyle = { flexDirection: "column-reverse" };
      iconStyle = { marginTop: "8px" };
      break;
    default:
      contentStyle = { flexDirection: "row" };
      iconStyle = { marginRight: "8px" };
      break;
  }
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      className={classNames(
        classes.button,
        { [classes.disabledButton]: !!disabled },
        { [classes.primaryButton]: style === "primary" || !style },
        { [classes.secondaryButton]: style === "secondary" },
        className
      )}
    >
      <div className={classes.content} style={contentStyle}>
        {icon && <img src={icon} className={classes.icon} style={iconStyle} />}
        <div className={classes.text}>{text}</div>
      </div>
    </div>
  );
}
