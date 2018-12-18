import React from 'react';

const Maze = (props) => (
    <div className="maze-container">
        <div className="maze">
            <pre>{props.maze}</pre>
        </div>
        <p>Click "Create" button to start</p>
    </div>
);


export default Maze;