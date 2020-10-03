import React from 'react';
import logo from '../shiba-inu.svg';
// import logo from '../logo.svg'

function Home() {

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
          href="http://localhost:3002/gameplay/101"  
        >
          Go to room 101
        </a>
      </header>
    </div>
    )
}
export default Home