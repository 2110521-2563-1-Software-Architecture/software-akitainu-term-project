import React, {useEffect, useState, useCallback, useMemo} from 'react'
import { Grid,
  makeStyles,
  Typography,
  Avatar,
  Tooltip,
  Grow,
  TextField,
} from '@material-ui/core'
import Ripples from 'react-ripples'
import { roomMessages,privateMessages } from './mock'
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';
import {Palette} from 'components'
import CloseIcon from '@material-ui/icons/Close';

//setting chat size here
const width = "300px"           
const height = "400px"           
const spaceBetweenBubbleBox = "16px"
const spaceBubble = "48px"
const spaceChatBoxHeader = "40px"
const spaceChatBoxInput = "56px"

//dont change here
const chatBoxHeight = `calc(${height} - ${spaceBetweenBubbleBox} - ${spaceBubble})`
const chatBoxContainer = `calc(${chatBoxHeight} - ${spaceChatBoxHeader} - ${spaceChatBoxInput})`

const useStyles = makeStyles((theme)=>({
  root : {
    position:"fixed",
    width:width,
    height:height,
    // background:"black",
    // background:"rgba(255,255,255,0.5)",
    marginLeft:`calc(100vw - ${width} - 16px)`,
    marginTop:`calc(100vh - ${height} - 64px - 24px)`,
    borderRadius:"8px",
    [theme.breakpoints.up('md')] : {
      width:width,
      height:height,
      marginLeft:`calc(100vw - ${width} - 16px)`,
      marginTop:`calc(100vh - ${height} - 64px - 24px)`,
    },
    transition:"background 0.3s ease-in-out"
  },
  chatBox : {
    display:"flex",
    // background:Palette.blue200,
    borderRadius:"8px",
    height:chatBoxHeight,
    flexDirection:"column",
    // boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    "& .chatHeader" : {
      height:spaceChatBoxHeader,
      display:"flex",
      flexDirection:"row",
      borderRadius:"8px 8px 0 0",
      // background:"purple",
      "& .username" : {
        margin:"4px 0 4px 0",
        background:Palette.blue300,
        padding:"4px 16px",
        fontSize:"16px",
        borderRadius:"16px",
        color:Palette.yellow100,
        cursor:"pointer",
      },
      "& .closeButton" : {
        margin:"4px 0px 4px auto",
        background:Palette.blue300,
        padding:"4px 4px",
        fontSize:"16px",
        borderRadius:"16px",
        color:Palette.yellow100,
        cursor:"pointer",
      },
    },
    "& .chatContainer" : {
      height:chatBoxContainer,
      background:"red",
      borderRadius:"8px",
      // background:"red",
      "& .chatbox" : {
        
      }
    },
    "& .chatInput" : {
      height:spaceChatBoxInput,
      // background:"blue",
      borderRadius:"0 0 8px 8px",
      "& .textfieldWrapper" : {
        background:Palette.blue300,
        borderRadius:"8px",

        margin:"8px 0 0 0px",
        "& .textfield" : {
          marginLeft:"8px",
          width:`calc(${width} - 16px)`,
        }
      },
    },
  },
  chatSelect : {
    // background:Palette.red100,
    borderRadius:"8px",
    marginTop:spaceBetweenBubbleBox,
    height:spaceBubble,
    display:"flex",
    alignItems:"center",
    flexDirection:"row-reverse",
  },
  chatBubble : {
    cursor:"pointer",
    background:Palette.grey100,
    color:"white",
    // boxShadow:"0 2px 4px 0 #888888",
  },
  divider : {
    height:"40px",
    background:Palette.red100,
    width:"2px",
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
  },
  ripple : {
    borderRadius:"100%",
    height:"40px",
    width:"40px",
    margin:"0px 8px",
    // boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
  },
  textfieldInput : {
    color:"white"
  }
}))

const chatRootStyle = (isHover) => {
  if (isHover) {
    return {
      background:"rgba(255,255,255,0.9)"
    }
  }
  else {
    return {
      background:"rgba(255,255,255,0.3)"
    }
  }
}

function Chat() {
  const classes = useStyles()
  const [isHover,setIsHover] = useState(false)
  const chatStyle = chatRootStyle(isHover)
  const [messageGroup,setMessageGroup] = useState({})
  const [peopleBubbles,setPeopleBubbles] = useState()
  const [showMessage,setShowMessage] = useState(false)
  const [currentShowMessage,setCurrentShowMessage] = useState("")

  const thisUsername = "bump"
  const thisRoomId = 101

  useEffect(()=>{
    setMessageGroup({
      room : {
        messages:roomMessages,
      },
      private : {
        messages:privateMessages,
      }
    })
  },[])

  useMemo(() => {
    let peopleData = []
    let peopleList = []
    if (messageGroup.private) {
      messageGroup.private.messages.forEach((message,index)=>{
        if ( !peopleList.includes(message.fromUsername) ) {
          var randomColor = Math.floor(Math.random()*16777215).toString(16);
          // peopleList.push(people.fromUsername)
          let data = {
            name:message.fromUsername,
            color:`#${randomColor}`,
          }
          peopleData.push(data)
          peopleList.push(message.fromUsername)
        }
      })
    }
    setPeopleBubbles(peopleData)

  },[setMessageGroup,messageGroup])

  const handleshowMessage = (username) => {
    if (currentShowMessage!==username && currentShowMessage !== "" && showMessage===true) return setCurrentShowMessage(username)
    setShowMessage((status)=>!status)
    setCurrentShowMessage(username)
  }

  const handleCloseMessage = () => {
    setShowMessage(false)
    var timeout  = setTimeout(function(){ 
      setCurrentShowMessage("")
     }, 3000);
     clearTimeout(timeout);
  }

  // useEffect(()=>{
  //   console.log(messageGroup)
  // },[messageGroup])

  // useEffect(()=>{
  //   console.log(peopleBubbles)
  // },[peopleBubbles])

  const chatBox = () => (
    <Grow in={ showMessage } {...{timeout:250}}>
      <Grid className={classes.chatBox}>
        {/* <Typography >{`${currentShowMessage}`}</Typography> */}
        <div className="chatHeader">
          <div className="username">{currentShowMessage}</div>
          <div className="closeButton" onClick={()=>{handleCloseMessage()}}><CloseIcon/></div>
        </div>
        <div className="chatContainer">
          <div className="chatbox">container</div>
        </div>
        <div className="chatInput">
          <div className="textfieldWrapper">
            <TextField className="textfield" 
            InputProps={{
              classes: {
                input: classes.textfieldInput
              }
            }} 
            size="small"/>
          </div>
        </div>
      </Grid>
    </Grow>
  )

  const chatBubbles = () => (
      <Grid className={classes.chatSelect}>
        <Ripples className={classes.ripple} onClick={()=>handleshowMessage("room")}><Tooltip title="Room chat" placement="bottom" arrow interactive>
          <Avatar className={classes.chatBubble}>R</Avatar>
        </Tooltip></Ripples>
        <div className={classes.divider}></div>
        {peopleBubbles && peopleBubbles.map((people,index)=>(
          <Ripples className={classes.ripple} onClick={()=>handleshowMessage(people.name)}><Tooltip title={people.name} placement="bottom" arrow interactive>
            <Avatar key={`${people.name}-${index}`} className={classes.chatBubble}>{people.name[0]}</Avatar>
          </Tooltip></Ripples>
        ))}
      </Grid>
  )

  return (
    <Grid className={classes.root} onMouseEnter={()=>{setIsHover(true)}} onMouseLeave={()=>{setIsHover(false)}}>
      {chatBox()}
      {chatBubbles()}
    </Grid>
  )
}
export default Chat