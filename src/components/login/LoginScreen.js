import React from "react";
import { Link } from "react-router-dom";
import './Login.css';

export default ({ owners, teamNames, ownerLogin }) => (
  <section id="login">
    <div className="login">
      <div className="loginContainer">
        <div className="loginHeader">
          <h1> Welcome to the 2020 March Madness Draft! </h1>
          <small> Please select your name from the list below to login </small>
        </div>
        <Link to="/draft">
          <div className="ownersLoginList">
            {owners.map((owner, i) => {
              return (
                <div key={i} onClick={() => {ownerLogin(owner)}}>
                  <p>{owner}</p>
                  {/* <small>{teamNames[i]}</small> */}
                </div>
              )
            })}
            <div onClick={() => {ownerLogin('Admin')}}>
              <p>Admin</p>
              {/* <small>Draft for All</small> */}
            </div>
          </div>
        </Link>
      </div>
    </div>
  </section>
);
