import React from 'react';

const StatusBar = (props) => (
  <div className="status-bar">
      {props.status.join("\n")}
  </div>
);

export default StatusBar;