import React from 'react';

class ActionBar extends React.Component {
    handleCreateMaze = (e) => {
        e.preventDefault();
        this.props.handleCreateMaze();
    };
    handleSolveMaze = (e) => {
        e.preventDefault();
        this.props.handleSolveMaze();
    };
    render() {
        return (
            <div>
                <button onClick={this.handleCreateMaze}>Create</button>
                <button onClick={this.handleSolveMaze}>Solve</button>
            </div>
        );
    }
}

export default ActionBar;