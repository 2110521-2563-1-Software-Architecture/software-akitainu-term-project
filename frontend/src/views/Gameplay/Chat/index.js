import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  makeStyles,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { roomMessages, privateMessages } from "./mock";
import { Palette } from "components";
import CloseIcon from "@material-ui/icons/Close";
import SendIcon from "@material-ui/icons/Send";
import { Type } from "react-feather";
import Redirect from "components/Redirect";

//setting chat size here
var width = "300px";
var height = "400px";
const spaceBetweenBubbleBox = "16px";
const spaceBubble = "48px";
const spaceChatBoxHeader = "40px";
const spaceChatBoxInput = "56px";

//dont change here
const chatBoxHeight = `calc(${height} - ${spaceBetweenBubbleBox} - ${spaceBubble})`;
const chatBoxContainer = `calc(${chatBoxHeight} - ${spaceChatBoxHeader} - ${spaceChatBoxInput})`;

const useStyles = makeStyles((theme) => ({
  root: {
    position: "fixed",
    width: width,
    height: height,
    // background:"blur(2px)",
    // background:"rgba(255,255,255,0.5)",
    zIndex: 200,
    marginLeft: `calc(100vw - ${width} - 24px)`,
    marginTop: `calc(100vh - ${height} - 24px)`,
    borderRadius: "8px",
    [theme.breakpoints.up("md")]: {
      width: width,
      height: height,
      marginLeft: `calc(100vw - ${width} - 24px)`,
      marginTop: `calc(100vh - ${height} - 24px)`,
    },
    transition: "background 0.3s ease-in-out",
  },
  chatBox: {
    display: "flex",
    // background:Palette.blue200,
    "& ::-webkit-scrollbar": {
      width: "4px",
    },
    "& ::-webkit-scrollbar-track": {
      // background: Palette.red100,
      borderRadius: "8px",
      width: "8px",
      filter: "blur(4px)",
      "-o-filter": "blur(4px)",
      "-ms-filter": "blur(4px)",
      "-moz-filter": "blur(4px)",
      "-webkit-filter": "blur(4px)",
    },
    "& ::-webkit-scrollbar-thumb ": {
      background: Palette.blue300,
      borderRadius: "8px",
      marginRight: "0 8px 8px 0",
    },
    "& ::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    borderRadius: "8px",
    height: chatBoxHeight,
    flexDirection: "column",
    // background:"red",
    // boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    "& .chatHeader": {
      height: spaceChatBoxHeader,
      display: "flex",
      flexDirection: "row",
      borderRadius: "8px 8px 0 0",
      // background:"purple",
      "& .username": {
        margin: "4px 0 4px 0",
        background: Palette.blue300,
        padding: "4px 16px",
        fontSize: "16px",
        borderRadius: "16px",
        color: Palette.yellow100,
        cursor: "pointer",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        width: "232px",
      },
      "& .closeButton": {
        margin: "4px 0px 4px auto",
        background: Palette.blue300,
        // backdropFilter:"blur(4px)",
        padding: "4px 4px",
        fontSize: "16px",
        borderRadius: "16px",
        color: Palette.yellow100,
        cursor: "pointer",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
      },
    },
    "& .chatContainer": {
      height: chatBoxContainer,
      borderRadius: "8px",
      // display:"none",
      // boxShadow:
      //   "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
      background: "rgba(244,241,222,0.8)",
      // border:"2px solid black",
      backdropFilter: "blur(4px)",
      "& .chatbox": {
        overflowY: "scroll",
        zIndex: -1,
        height: chatBoxContainer,
        display: "flex",
        flexDirection: "column",
        "& .chatboxText": {
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          color: "black",
          background: "white",
          maxWidth: "100px",
          padding: "2px 16px",
          borderRadius: "16px",
          textOverflow: "ellipsis",
          wordWrap: "break-word",
        },
        "& .chatboxAvatar": {
          width: "24px",
          height: "24px",
          fontSize: "12px",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
          background: Palette.blue300,
        },
        "& .chatboxUsername": {
          margin: "1px 0 4px 4px",
          borderRadius: "16px",
          color: "black",
        },
      },
    },
    "& .chatInput": {
      height: spaceChatBoxInput,
      // background:"blue",
      borderRadius: "0 0 8px 8px",
      "& .textfieldWrapper": {
        background: Palette.blue300,
        borderRadius: "8px",
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
        margin: "8px 0 0 0px",
        "& .textfield": {
          marginLeft: "8px",
          paddingTop: "4px",
          width: `calc(${width} - 16px)`,
        },
      },
    },
  },
  chatSelect: {
    // background:Palette.red100,
    borderRadius: "8px",
    marginTop: spaceBetweenBubbleBox,
    height: spaceBubble,
    display: "flex",
    alignItems: "center",
    flexDirection: "row-reverse",
  },
  chatBubble: {
    cursor: "pointer",
    background: Palette.grey100,
    color: "white",
    // boxShadow:"0 2px 4px 0 #888888",
  },
  divider: {
    height: "40px",
    background: Palette.red100,
    width: "2px",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
  },
  ripple: {
    borderRadius: "100%",
    height: "40px",
    width: "40px",
    margin: "0px 8px",
    // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    boxShadow:
      "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
  },
  textfieldInput: {
    color: "white",
  },
}));

const chatRootStyle = (isHover) => {
  if (isHover) {
    return {
      background: "rgba(255,255,255,0.9)",
    };
  } else {
    return {
      background: "rgba(255,255,255,0.3)",
    };
  }
};
var thisUserId;

function Chat({
  roomId: thisRoomId,
  socket,
  sendMessageRoom,
  usersData,
  ...rest
}) {
  const classes = useStyles();
  const [isHover, setIsHover] = useState(false);
  const chatStyle = chatRootStyle(isHover);
  const [messageGroup, setMessageGroup] = useState({
    room: {
      messages: [],
    },
    private: {
      messages: privateMessages,
    },
  });
  const [peopleBubbles, setPeopleBubbles] = useState();
  const [showChatbox, setShowChatbox] = useState(false);
  const [currentShowMessage, setCurrentShowMessage] = useState("");
  const [typing, setTyping] = useState("");
  const chatBoxElement = useRef(0);
  const [thisUsername, setUsername] = useState("");
  const [isUserJoined, setIsUserJoined] = useState(false);

  // const thisUsername = "bump";
  // const thisRoomId = 101;

  // useEffect(() => {
  //   setMessageGroup({
  //     room: {
  //       messages: roomMessages,
  //     },
  //     private: {
  //       messages: privateMessages,
  //     },
  //   });
  // }, []);

  // useEffect(()=>{
  // var tf = document.getElementById(`room-${thisRoomId}-chat-box`)
  // tf.scrollTop = tf.offsetHeight;
  // console.log(tf)
  //   console.log(messageGroup)
  // },[messageGroup])

  const pushRoomMessage = (data) => {
    let roomMes = messageGroup.room.messages;
    // console.log(roomMes)
    roomMes.push({
      fromRoomId: thisRoomId,
      fromUsername: data.fromUsername,
      message: data.message,
      fromUserId: data.fromUserId,
    });
    setMessageGroup({
      ...messageGroup,
      ...{ room: { messages: roomMes } },
    });
  };

  const getMsgKey = (currentShowMessage) => {
    if (currentShowMessage === "room") {
      return "room";
    } else return "private";
  };

  const filterMsg = (data) => {
    // console.log("filterMsg : ",data)
    if (data.fromRoomId) {
      // console.log("match room id ")
      return parseInt(data.fromRoomId) === parseInt(thisRoomId) ? true : false;
    } else {
      if (
        data.fromUsername === thisUsername &&
        data.toUsername === currentShowMessage
      ) {
        return true;
      } else if (
        data.fromUsername === currentShowMessage &&
        data.toUsername === thisUsername
      ) {
        return true;
      }
    }
  };

  useEffect(() => {
    // console.log(usersData);
    if (usersData.length !== 0) {
      thisUserId = sessionStorage.getItem("userId");
      usersData.forEach((user) => {
        if (user.userId === thisUserId) {
          return setIsUserJoined(true);
        }
      });
      // thisUserId = undefined
    }
  }, [usersData]);
  // const getMessage = () => {
  //   socket.on("message-get-room", (data) => {
  //     console.log("message-get-room", data);

  //   });
  // }

  useEffect(() => {
    // console.log(socket);
    var person =
      sessionStorage.getItem("userName") ||
      window.sessionStorage.getItem("userId");
    setUsername(person);
    socket.on("message-get-room", (data) => {
      console.log("message-get-room-hook", data);
      pushRoomMessage(data);
    });
    socket.on("debug", (data) => {
      console.log(data);
    });
  }, []);

  // const sendMessageRoom = (fromUserId,fromRoomId,fromUsername,message) => {
  //   let data = {
  //     fromUserId : fromUserId,
  //     fromRoomId : fromRoomId,
  //     fromUsername : fromUsername,
  //     message : message,
  //   }
  //   console.log("message-send-room")
  //   socket.emit("message-send-room", data);
  //   // socket.on("message-send-room", (data) => {
  //   //   console.log("new-select", data);

  //   //   const { userId, roomId, targetId} = data;
  //   //   if (this.state.roomId !== roomId) return;

  //   //   this.setState({showCardSelectorDialog:1});
  //   // });
  // }

  useMemo(() => {
    let peopleData = [];
    let peopleList = [thisUsername];
    if (messageGroup.private) {
      messageGroup.private.messages.forEach((message, index) => {
        if (!peopleList.includes(message.fromUsername)) {
          var randomColor = Math.floor(Math.random() * 16777215).toString(16);
          let data = {
            name: message.fromUsername,
            color: `#${randomColor}`,
          };
          peopleData.push(data);
          peopleList.push(message.fromUsername);
        }
      });
    }
    setPeopleBubbles(peopleData);
  }, [setMessageGroup, messageGroup]);

  const handleshowMessage = (username) => {
    if (
      currentShowMessage !== username &&
      currentShowMessage !== "" &&
      showChatbox === true
    )
      return setCurrentShowMessage(username);
    setShowChatbox((status) => !status);
    setCurrentShowMessage(username);
  };

  const handleCloseMessage = () => {
    setShowChatbox(false);
    var timeout = setTimeout(function () {
      setCurrentShowMessage("");
    }, 3000);
    clearTimeout(timeout);
  };

  const handleTyping = (e) => {
    setTyping(e.target.value);
  };

  const testApi = () => {
    let data = {
      roomId: thisRoomId,
      userId: "456",
    };
    console.log("testApis", data);
    socket.emit("game-rank-win", data);
  };

  const handleEnter = () => {
    if (typing) {
      if (currentShowMessage === "room") {
        // let roomMes = messageGroup.room.messages;
        sendMessageRoom(
          sessionStorage.getItem("userId"),
          100001,
          thisUsername,
          typing
        );
        // roomMes.push({
        //   fromRoomId: parseInt(thisRoomId),
        //   fromUsername: thisUsername,
        //   message: typing,
        // });
        // setMessageGroup({
        //   ...messageGroup,
        //   ...{ room: { messages: roomMes } },
        // });
      } else {
        let privateMes = messageGroup.private.messages;
        privateMes.push({
          fromUsername: thisUsername,
          toUsername: currentShowMessage,
          message: typing,
        });
        setMessageGroup({
          ...messageGroup,
          ...{ private: { messages: privateMes } },
        });
      }
      setTyping("");
    }
  };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef();
    useEffect(() =>
      elementRef.current.scrollIntoView({ block: "end", behavior: "smooth" })
    );
    return <div ref={elementRef} />;
  };

  const chatBox = () => (
    <Grow in={showChatbox} {...{ timeout: 250 }}>
      <div className={classes.chatBox}>
        {/* <Typography >{`${currentShowMessage}`}</Typography> */}
        <div className="chatHeader">
          {currentShowMessage === "room" ? (
            <div className="username">
              {isUserJoined
                ? `chat ${currentShowMessage} : ${thisRoomId}`
                : "PLS JOIN ROOM FIRST"}
            </div>
          ) : (
            <div className="username">{currentShowMessage}</div>
          )}
          <IconButton
            className="closeButton"
            onClick={() => {
              handleCloseMessage();
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="chatContainer">
          <div
            className="chatbox"
            id={`room-${thisRoomId}-chat-box`}
            ref={chatBoxElement}
          >
            {messageGroup.room &&
              messageGroup[getMsgKey(currentShowMessage)].messages.map(
                (data) =>
                  filterMsg(data) && (
                    // console.log("checkid",data.fromRoomId === thisUserId),
                    // console.log("checkid",data.fromRoomId, thisUserId),
                    // console.log("checkid",typeof(data.fromRoomId) ,typeof(thisUserId)),
                    <div
                      style={{
                        margin:
                          parseInt(data.fromUserId) === parseInt(thisUserId)
                            ? "8px 16px 4px auto"
                            : "8px 0 4px 16px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <Avatar
                          className="chatboxAvatar"
                          style={{
                            margin:
                              parseInt(data.fromUserId) === parseInt(thisUserId)
                                ? "0 0 0 auto"
                                : "0",
                          }}
                        >
                          {data.fromUsername ? data.fromUsername[0] : "?"}
                        </Avatar>
                        <Typography className="chatboxUsername">
                          {data.fromUsername}
                        </Typography>
                      </div>
                      <div style={{ display: "flex" }}>
                        <Typography align="left" className="chatboxText">
                          {data.message}
                        </Typography>
                      </div>
                    </div>
                  )
              )}
            <AlwaysScrollToBottom />
          </div>
        </div>
        <div className="chatInput">
          <div className="textfieldWrapper">
            <TextField
              className="textfield"
              placeholder="Aa..."
              onChange={handleTyping}
              value={typing}
              disabled={!isUserJoined}
              onKeyPress={(e) => {
                // console.log(e.key);
                if (e.key === "Enter") {
                  handleEnter();
                }
              }}
              InputProps={{
                classes: {
                  input: classes.textfieldInput,
                },
                endAdornment: (
                  <InputAdornment position="end">
                    <SendIcon
                      style={{
                        color: Palette.yellow100,
                        marginTop: "-3px",
                        cursor: "pointer",
                      }}
                      onClick={handleEnter}
                    />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </div>
        </div>
      </div>
    </Grow>
  );

  const chatBubbles = () => (
    <div className={classes.chatSelect}>
      <IconButton
        className={classes.ripple}
        onClick={() => handleshowMessage("room")}
      >
        <Tooltip title="Room chat" placement="bottom" arrow interactive>
          <Avatar
            className={classes.chatBubble}
            style={{ background: Palette.blue300 }}
          >
            R
          </Avatar>
        </Tooltip>
      </IconButton>
      <div className={classes.divider}></div>
      {peopleBubbles &&
        peopleBubbles.map((people, index) => (
          <IconButton
            className={classes.ripple}
            onClick={() => handleshowMessage(people.name)}
          >
            <Tooltip title={people.name} placement="bottom" arrow interactive>
              <Avatar
                key={`${people.name}-${index}`}
                className={classes.chatBubble}
                style={{ background: Palette.green400 }}
              >
                {people.name[0]}
              </Avatar>
            </Tooltip>
          </IconButton>
        ))}
    </div>
  );

  return (
    <div
      className={classes.root}
      style={{ zIndex: showChatbox ? "" : 4 }}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      {chatBox()}
      {chatBubbles()}
      {/* {getMessage()} */}
      <button onClick={() => testApi()}>test api</button>
    </div>
  );
}
export default Chat;
