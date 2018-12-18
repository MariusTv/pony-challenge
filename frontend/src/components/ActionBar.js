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
            <div className="action-bar">
                <button  className="btn" disabled={this.props.state !== ""} onClick={this.handleCreateMaze}>Create</button>
                <button className="btn" disabled={this.props.state !== "Maze created"} onClick={this.handleSolveMaze}>Solve</button>
            </div>
        );
    }
}

export default ActionBar;