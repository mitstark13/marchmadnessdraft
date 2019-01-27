import React from "react";
import './DraftHistory.css';

export default ({ players }) => (

  <div className="draftHistory">
    <div className="historyTitle">
      <h2>Draft History</h2>
      <p>"Wait...who did he just pick?"</p>
      <p>- Nobody anymore</p>
    </div>
    <table>
      <thead>
        <tr>
          <th className="pick">#</th>
          <th className="name">Player</th>
          <th className="owner">Owner</th>
        </tr>
      </thead>
      <tbody>
      {players.map((player, i) => {
        const drafted = player.pickNumber > 0

        if (drafted) {
          return (
            <tr key={i}>
              <td className="pick">{player.pickNumber}</td>
              <td className="name">{player.name}</td>
              <td className="owner">{player.owner}</td>
            </tr>
          );
        } else {
          return false
        }
      })}
      </tbody>
    </table>
  </div>
);