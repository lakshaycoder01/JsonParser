import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Parser from './parser';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 style={{margin:"auto"}}>JSON Parser</h1>
        </header>

        <div className="app-container">
          <Route exact={true} path="/" component={Parser}/>
        </div>

      </div>
    );
  }
}

export default App;
