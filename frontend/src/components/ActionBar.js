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
                <button  className="btn" disabled={this.props.isCreated} onClick={this.handleCreateMaze}>Create</button>
                <button className="btn" disabled={!this.props.isCreated} onClick={this.handleSolveMaze}>Solve</button>
            </div>
        );
    }
}

export default ActionBar;