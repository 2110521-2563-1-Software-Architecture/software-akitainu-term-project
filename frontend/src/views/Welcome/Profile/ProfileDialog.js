import React from 'react'
import {
  Dialog,
  Slide,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme)=>({
  root : {
    // "& .MuiDialog-paper" : {
    //   background:"red",
    // }
  },
  container : {
    // width:"80vw",
    background:"#465A74",
    borderRadius:"16px",
  },
  detailImage : {
    borderRadius:"100%",
    width:"100px",
  },
  detailContent : {
    minWidth:"200px",
    background:"#B6C5E0",
    margin:"16px",
    padding:"16px 102px 16px 16px",
    borderRadius:"16px",
    border:"3px solid black",
  },
  detailText : {
    fontFamily: "Kanit",
    fontSize:"24px",
  },
  dialogPaper: {
    background:"none",
  }
}))

function ProfileDialog({open, handleClose, profileResouce}) {
  const classes = useStyles()

  const Title = () => (
    <Grid><Typography>Profile</Typography></Grid>
  )

  const Detail = () => (
    <Grid container>
      <Grid style={{display:"flex",justifyContent:"center",alignItems:"center",paddingLeft:"16px"}}>       
        <img 
          className={classes.detailImage}
          src={profileResouce.imgSrc} 
          alt="alternatetext"
        />
      </Grid>
      <Grid className={classes.detailContent}>
        <Typography className={classes.detailText}>{profileResouce.userName}</Typography>
        <Typography className={classes.detailText}>{`Rank ${profileResouce.userRank}`}</Typography>
        <Typography className={classes.detailText}>{`Level ${profileResouce.userLevel}`}</Typography>
        <Typography className={classes.detailText}>{`Win rate ${profileResouce.userLevel}`}</Typography>
        <Typography className={classes.detailText}>{`Exp ${profileResouce.userLevel}`}</Typography>
      </Grid>
  </Grid>
  )


  const PaperProps = {
      paper : classes.dialogPaper
  }

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
        <Detail/>
        <Grid></Grid>
      </Grid>
    </Dialog>
  )
}
export default ProfileDialog