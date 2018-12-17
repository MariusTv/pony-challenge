import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import './App.css';
import Header from './components/Header';
import Maze from './components/Maze';
import ActionBar from './components/ActionBar';
import Footer from './components/Footer';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            status: 'Click Create button to start',
            maze: null,
        };
    }
    componentDidMount() {
        const pusher = new Pusher('3c69a0dded15876990e0', {
            cluster: 'eu',
            encrypted: true
        });
        const channel = pusher.subscribe('maze');
        channel.bind('mazeChange', data => {
            this.setState({ maze: data.maze });
        });
        channel.bind('statusChange', data => {
            console.log('status', data);
            this.setState({ status: data.status});
        });
    }

    handleCreateMaze  =  async () => {
        let maze = null;
        await axios.get('http://localhost:5000/api/create-maze')
            .then((response) => {
                maze = (response.data);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
        if (maze) {
            this.setState({
                maze
            });
        }

    };
    handleSolveMaze() {
        axios.get('http://localhost:5000/api/solve-maze')
            .then((response) => {

            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
    }
    render() {
        return (
          <div className="App">
              <Header />
              <Maze maze={this.state.maze} status={this.state.status}/>
              <ActionBar
                  handleCreateMaze={this.handleCreateMaze}
                  handleSolveMaze={this.handleSolveMaze}
              />
              <Footer/>
          </div>
        );
    }
}

export default App;
