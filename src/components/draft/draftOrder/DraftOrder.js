import React, { Component } from "react";
import './DraftOrder.css';

class DraftOrder extends Component {

  render() {
    let owners = this.props.owners;
    // let newRoundFix = 0;

    return (
      <div className="draftOrder">
        <div id="countdown">
          <div id='tiles'></div>
          <div className="labels">
            <li>Minutes</li>
            <li>Seconds</li>
          </div>
        </div>

        {owners.map((owner, i) => {
          // newRoundFix = owner > 0 ? -1 : newRoundFix //i is still incrementing on the new round boxes
          let pickNumber = Number(this.props.pickNumber) + i;
          
          return (
            <div key={i} className={i < 1 ? 'orderOwner active' : 'orderOwner waiting'}>
              {owner > 0 ? <b>Round</b> : "Pick #" + (pickNumber)}
              <br/>
              {owner > 0 ? <b>{owner + 1}</b> : <span className="name">{owner.name}</span>}
            </div>
          )

        })}
      </div>
    );
  }
}

export default DraftOrder;