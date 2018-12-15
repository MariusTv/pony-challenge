import React from 'react';
import axios from 'axios';

class Maze extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            maze: null,
            mazeId: null
        };
    }

    componentDidMount() {
        axios.get('https://ponychallenge.trustpilot.com/pony-challenge/maze/55155e43-f852-4f51-b624-5bb506a93b77/print')
            .then((response) =>  {
                const maze = (response.data);

                this.setState({
                    isLoaded: true,
                    maze,
                    mazeId: 123
                });
            })
            .catch((error) => {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });



    }
    onSolveClick() {

    }
    render() {
        const { error, isLoaded, maze, mazeId} = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <div>
                        <pre>{maze}</pre>
                    </div>
                    {mazeId &&
                    <div>
                        <button onClick={this.onSolveClick}>Solve</button>
                    </div>}

                </div>
            );
        }
    }
}


export default Maze;