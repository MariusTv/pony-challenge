import React from 'react';

const Maze = (props) => (
    <div>
        <div className="maze">
            <pre>{props.maze}</pre>
        </div>
        <div>{props.status}</div>
    </div>
);


export default Maze;