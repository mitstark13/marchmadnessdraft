import React from "react";
import './DraftTeams.css';

export default ({ players, owner, viewNewTeam, ownersList }) => (
  <div className="teamsView">
    <div className="teamsHeader">
      <h2>View teams</h2>
      <select className="teamSelect" onChange={viewNewTeam}>
        {ownersList.map((ownerName, i) => {
          return (
            <option value={ownerName} key={i}>{ownerName}</option>
          )
        })}
      </select>
    </div>
    <table>
      <thead>
        <tr>
          <th className="name">Player</th>
          <th className="school">School</th>
        </tr>
      </thead>
      <tbody>
      {players.map((player, i) => {
        if (player.owner === owner) {
          return (
            <tr key={i}>
              <td className="name">{player.name}</td>
              <td className="school">{player.team}</td>
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
