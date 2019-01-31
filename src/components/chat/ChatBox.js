import React, { Component } from "react";
import './ChatBox.css';

class ChatBox extends Component {

  render() {

    return (
      <div>
        <div className="row">
          <div className="chatInput">
            <input
              type="text"
              value={this.props.text}
              placeholder="chat here..."
              className="form-control"
              onChange={this.props.handleTextChange}
              onKeyDown={this.props.handleTextChange}
            />
            <button onClick={this.props.submitMessage} >Send</button>

            <div className="clearfix"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChatBox;
