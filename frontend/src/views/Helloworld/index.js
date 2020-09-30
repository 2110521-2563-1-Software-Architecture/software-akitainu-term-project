import React from 'react'
import { useParams } from "react-router-dom";

function Helloworld() {
    let { username } = useParams();

    return(
        <p>{`hello ${username}`}</p>
    )
}
export default Helloworld