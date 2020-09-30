import React from 'react';
import './App.css';
import Routes from "./Routes";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";
const history = createBrowserHistory();

function App() {
  return (
    <Router history={history}>
      <Routes/>
    </Router>
  );
}

export default App;
