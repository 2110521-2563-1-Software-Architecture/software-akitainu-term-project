import React from 'react'
import {
  Grid,
  Typography,
  Dialog,
  makeStyles,
} from '@material-ui/core'
import profileBox from './components/profileBox.svg'

const useStyles = makeStyles((theme)=>({
  root : {
    // background:"yellow",
    height:"100%",
    // backgroundImage: `url(${profileBox})`,
  },
  profileImage : {
    borderRadius:"100%",
    // transform:"scale(2)",
    // padding:"8px",
    width:"100px",
  },
  profileText : {
    fontFamily: "Kanit",
    // fontWeight:600,
    fontSize:"24px",
  }
}))

function Profile() {
  const classes = useStyles()
  const imgSrc = sessionStorage.getItem("profileImgUrl")
  const userName = sessionStorage.getItem("userName")
  const userRank = sessionStorage.getItem("userRank")
  const userLevel = sessionStorage.getItem("userLevel")

  return (
    <Grid className={classes.root} container>
      <Grid container item xs={4} alignItems="center" justify="center">
        <img 
        className={classes.profileImage}
        src={imgSrc} 
        alt="alternatetext"
      />
      </Grid>
      <Grid container item xs={8} direction="column" justify="center">
        <Typography className={classes.profileText}>{userName}</Typography>
        <Typography className={classes.profileText}>{`Rank ${userRank}`}</Typography>
        <Typography className={classes.profileText}>{`Level ${userLevel}`}</Typography>
      </Grid>
    </Grid>
  )
}

export default Profile