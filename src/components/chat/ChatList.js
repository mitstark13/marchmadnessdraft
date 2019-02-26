import React from "react";
import "./ChatList.css";

export default ({ chats, username }) => (
  <ul className="draftChat">
    {chats.map((chat, i) => {
      let classname = chat.username === username ? "col-xs-12 userMessage" : "col-xs-12"
      return (
        <div key={i}>
          <div className="row show-grid">
            <div className={classname}>
              
              <div className="chatMessage" >
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
