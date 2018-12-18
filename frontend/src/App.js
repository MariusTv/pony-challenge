import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import Header from './components/Header';
import Maze from './components/Maze';
import ActionBar from './components/ActionBar';
import StatusBar from './components/StatusBar';
import Footer from './components/Footer';
import './styles/App.css';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            state: '',
            actions: [],
            stepCount: 0,
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
            const stepNumber = this.state.stepCount + 1;
            this.setState({
                stepCount: stepNumber,
                actions: [`Step ${stepNumber}: ${data.result}`, ...this.state.actions],
                state: data.state
            });
        });
    }

    handleCreateMaze  =  async () => {
        let maze = null;
        await axios.get('/api/create-maze')
            .then((response) => {
                maze = (response.data);
            })
            .catch((error) => {
                // handle error
                console.log(error);
            });
        if (maze) {
            this.setState({
                maze,
                state: "Maze created",
                actions: [],
                stepCount: 0
            });
        }

    };
    handleSolveMaze() {
        axios.get('/api/solve-maze').catch((error) => {
            // handle error
            console.log(error);
        });
    }
    render() {
        return (
          <div className="App">
              <Header />
              <Maze maze={this.state.maze}/>
              <ActionBar
                  state={this.state.state}
                  handleCreateMaze={this.handleCreateMaze}
                  handleSolveMaze={this.handleSolveMaze}
              />
              <StatusBar status={this.state.actions}/>
              <Footer/>
          </div>
        );
    }
}

export default App;