import React, {useState} from 'react'
import { Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles((theme)=>({
  root : {
    position:"fixed",
    width:"400px",
    height:"200px",
    background:"rgba(255,255,255,0.5)",
    marginLeft:"calc(100vw - 400px - 16px)",
    marginTop:"calc(100vh - 200px - 64px - 16px)",
    borderRadius:"8px",
    [theme.breakpoints.up('md')] : {
      width:"400px",
      height:"200px",
      marginLeft:"calc(100vw - 400px - 16px)",
      marginTop:"calc(100vh - 200px - 64px - 16px)",
    },
    transition:"background 0.3s ease-in-out"
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



  return (
    <Grid className={classes.root} style={chatStyle} onMouseEnter={()=>{setIsHover(true)}} onMouseLeave={()=>{setIsHover(false)}}>
      <Typography >Chat component is coming soon</Typography>
    </Grid>
  )
}
export default Chat