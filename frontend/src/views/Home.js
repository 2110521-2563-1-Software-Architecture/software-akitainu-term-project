import React from "react";
import logo from "../shiba-inu.svg";
// import logo from '../logo.svg'

function Home() {

  const joinRoom100001 = () => {
    // todo:
    var userIdPlaceholder = Math.floor(100000 + Math.random() * 900000)
    const userId = prompt("Please enter your user Id",userIdPlaceholder);
    window.sessionStorage.setItem("userId", userId);
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
        <a
          className="App-link"
          href="http://localhost:3002/helloworld/shiba_lover"
        >
          Try Helloworld with shiba_lover
        </a>
        <a
          className="App-link"
          href="http://localhost:3002/gameplay/100001"
          onClick={() => joinRoom100001()}
        >
          Go to room 100001
        </a>
      </header>
    </div>
  );
}
export default Home;
