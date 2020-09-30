import React, {useEffect} from 'react'
import { useHistory } from "react-router";

function Redirect({to}) {
    const history = useHistory()

    useEffect(()=>{
        history.push(to)
        history.go(0)
    },[])

    return <div></div>

}
export default Redirect