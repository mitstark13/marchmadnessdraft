import React, { Component } from "react";
import './DraftOrder.css';

class DraftOrder extends Component {

  render() {
    let owners = this.props.owners;
    let pickNumber = this.props.pickNumber;
    let newRoundFix = 0;

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
          newRoundFix = owner > 0 ? -1 : newRoundFix //i is still incrementing on the new round boxes
          
          return (
            <div key={i} className={i < 1 ? 'orderOwner active' : 'orderOwner waiting'}>
              {owner > 0 ? <b>Round</b> : "Pick #" + (pickNumber + i + newRoundFix)}
              <br/>
              {owner > 0 ? <b>{owner + 1}</b> : owner}
            </div>
          )

        })}
      </div>
    );
  }
}

export default DraftOrder;