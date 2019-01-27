import React from "react";
import "./ChatList.css";

export default ({ chats }) => (
  <ul className="draftChat">
    {chats.map((chat, i) => {
      return (
        <div key={i}>
          <div className="row show-grid">
            <div className="col-xs-12">
              
              <div className="chatMessage">
                <div key={chat.id} className="box">
                  <p className="name"> {chat.username} </p>
                  <p className="message">{chat.message}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    })}
  </ul>
);
