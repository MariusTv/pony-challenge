import React from 'react';

const Maze = (props) => (
    <div>
        <div className="maze">
            <pre>{props.maze}</pre>
        </div>
        <div className="status-line">{props.status}</div>
    </div>
);


export default Maze;