import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from './components/Header';
import Maze from './components/Maze';
import ActionBar from './components/ActionBar';

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header />
          <Maze/>
      </div>
    );
  }
}

export default App;
