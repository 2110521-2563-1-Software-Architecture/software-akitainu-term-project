import React from "react";
import { useHistory } from "react-router-dom";
import Welcome from "./Welcome";

function Home() {
  const history = useHistory();
  const handleRedirect = (to) => {
    history.push(to);
    history.go(0);
  };
  return (
    <div>
      <Welcome />
      <span // todo: remove this
        className="App-link"
        onClick={() => handleRedirect("/gameplay/100001")}
      >
        Go to room 100001
      </span>
    </div>
  );
}
export default Home;
