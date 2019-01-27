import React from "react";
import './DraftOrder.css';

export default ({ owners, pickNumber }) => (

  <div className="draftOrder">
    <div id="countdown">
      <div id='tiles'></div>
      <div className="labels">
        <li>Minutes</li>
        <li>Seconds</li>
      </div>
    </div>

    {owners.map((owner, i) => {

    return (
      <div key={i} className={i < 1 ? 'orderOwner active' : 'orderOwner waiting'}>
        {owner > 1 ? <b>Round</b> : "Pick #" + (pickNumber + i)}
        <br/>
        {owner > 1 ? <b>{owner}</b> : owner}
      </div>
    )

    })}
  </div>
);