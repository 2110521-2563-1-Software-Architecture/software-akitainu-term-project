import React, { useRef, useEffect, useState, useMemo } from 'react'
import {
  Dialog,
  Slide,
  Grid,
  makeStyles,
  Typography,
  IconButton,
  InputBase,
  ClickAwayListener ,
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit';
import { ShibaFoot, LogoutIcon }  from './components/icon'
import { useHistory } from "react-router-dom";
import { isElement } from "react-dom/test-utils";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    // "& .MuiDialog-paper" : {
    //   background:"red",
    // }
  },
  container: {
    background: "#465A74",
    borderRadius: "16px",
    // width:"800px",
  },
  detailImage: {
    borderRadius: "100%",
    width: "415px",
  },
  detailContent : {
    minWidth:"200px",
    background:"#B6C5E0",
    margin:"16px 32px 16px 16px",
    padding:"16px 16px 16px 16px",
    borderRadius:"16px",
    border:"3px solid black",
    display:"flex",
    flexDirection:"column",
  },
  detailText: {
    fontFamily: "Kanit",
    fontSize: "48px",
    lineHeight: "56px",
    transition: "all 0.2s ease-in-out",
  },
  dialogPaper: {
    background: "none",
    maxWidth: "1800px",
  },
  title: {
    fontFamily: "Kanit",
    fontSize: "72px",
    color: "white",
    margin: "16px auto 0px 512px",
  },
  editButton: {
    padding:"8px",
    // marginLeft:"256px",
    height:"64px",
    width:"64px",
  }
}))

function ProfileDialog({ open, handleClose, profileResouce }) {
  const classes = useStyles();
  const offsetTitle = useRef(0);
  const [footColor, setFootColor] = useState("#000000");
  const history = useHistory();
  const [nameEditing, setNameEditing] = useState(false);
  const [userName, setUsername] = useState(profileResouce.userName);

  const onLogout = () => {
    sessionStorage.clear();
    history.push("/home");
    history.go(0);
  };

  useEffect(()=>{

  },[])

  const handleChangeName = (name) => {
    setUsername(name)
    sessionStorage.setItem("userName",name)
  }

  const Title = () => (
    <Grid>
      <Typography className={classes.title}>Profile</Typography>
    </Grid>
  );

  const randomColor = () => {
    let color = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
    setFootColor(color)
  }

  const ProfileImage = React.memo(
    () => <img 
    className={classes.detailImage}
    src={profileResouce.imgSrc} 
    alt="alternatetext"
  />
    );

  const isListenClickAway = () => {
    return nameEditing ? "onClick":false
  }


  const detail = () => (
    <Grid container>
      <Grid style={{padding:"16px 32px 32px 32px",marginTop:"16px"}}>       
        {/* <img 
          className={classes.detailImage}
          src={profileResouce.imgSrc}
          alt="alternatetext"
        /> */}
        <ProfileImage/>
      </Grid>
      <Grid className={classes.detailContent}>
        <Grid container >
          <Typography className={classes.detailText} >Name : </Typography>
          <ClickAwayListener onClickAway={()=>{setNameEditing(false);console.log("click")}} mouseEvent={isListenClickAway()} touchEvent={false}>
          <InputBase 
            className={classes.detailText} 
            style={{margin:"-6px 0 0 8px"}} 
            value={userName} 
            disabled={!nameEditing} 
            onChange={(e)=>handleChangeName(e.target.value)}
            onKeyPress={(e)=>{
              if (e.key === "Enter") setNameEditing(false)
            }}
            onDoubleClick={()=>setNameEditing(true)}
          ></InputBase>
          </ClickAwayListener>
          <IconButton className={classes.editButton} style={{alignSelf:"flex-end"}} onClick={()=>setNameEditing((status)=>!status)}><EditIcon style={{fontSize:"40px"}}/></IconButton>
        </Grid>
        <Typography className={classes.detailText}>{`Rank ${profileResouce.userRank}`}</Typography>
        <Typography className={classes.detailText}>{`Level ${profileResouce.userLevel}`}</Typography>
        <Typography className={classes.detailText}>{`Win rate ${profileResouce.userLevel}`}</Typography>
        <Typography className={classes.detailText}>{`Exp ${profileResouce.userLevel}`}</Typography>
        <ShibaFoot style={{alignSelf:"flex-end",fill:footColor,cursor:"pointer"}} onClick={randomColor}/>
      </Grid>
    </Grid>
  );

  const Logout = () => (
    <Grid container>
      <IconButton
        style={{ marginLeft: "32px", marginBottom: "32px" }}
        onClick={onLogout}
      >
        <LogoutIcon />
      </IconButton>
      <Typography
        className={classes.detailText}
        onClick={onLogout}
        style={{
          marginTop: "16px",
          marginLeft: "16px",
          color: "white",
          cursor: "pointer",
        }}
      >{`Logout`}</Typography>
    </Grid>
  );

  const PaperProps = {
    paper: classes.dialogPaper,
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      onClose={handleClose}
      className={classes.root}
      classes={PaperProps}
    >
      <Grid className={classes.container}>
        <Title/>
        {detail()}
        <Logout/>
      </Grid>
    </Dialog>
  );
}
export default ProfileDialog;
