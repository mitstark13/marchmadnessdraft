import React from "react";
import './ChatBox.css';

export default ({ text, username, handleTextChange, submitMessage }) => (
  <div>
    <div className="row">
      <div className="chatInput">
        <input
          type="text"
          value={text}
          placeholder="chat here..."
          className="form-control"
          onChange={handleTextChange}
          onKeyDown={handleTextChange}
        />
        <button onClick={submitMessage} >Send</button>

        <div className="clearfix"></div>
      </div>
    </div>
  </div>
);
