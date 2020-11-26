import React from "react";
import Welcome from "./Welcome";

function Home(props) {
  const { matchmakingSocket } = props;
  return (
    <div>
      <Welcome matchmakingSocket={matchmakingSocket} />
    </div>
  );
}
export default Home;
