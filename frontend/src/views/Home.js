import React from "react";
import logo from "../shiba-inu.svg";
import { useHistory } from "react-router-dom";
// import logo from '../logo.svg'

function Home() {
  const history = useHistory();

  const joinRoom100001 = () => {
    // todo:
    // var userIdPlaceholder = Math.floor(100000 + Math.random() * 900000);
    // const userId = prompt("Please enter your user Id", userIdPlaceholder);
    // window.sessionStorage.setItem("userId", userId);
  };
  const onLogout = () => {
    sessionStorage.clear();
    history.push("/home");
    history.go(0);
  };
  const handleRedirect = (to) => {
    history.push(to);
    history.go(0);
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/views/Home.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <p className="akitainu">by software akitainu</p>
        <span
          className="App-link"
          onClick={() => handleRedirect("/helloworld/shiba_lover")}
        >
          Try Helloworld with shiba_lover
        </span>
        <span
          className="App-link"
          onClick={() => handleRedirect("/gameplay/100001")}
        >
          Go to room 100001
        </span>
        <button onClick={() => onLogout()} style={{ padding: "8px 16px" }}>
          logout
        </button>
      </header>
    </div>
  );
}
export default Home;
