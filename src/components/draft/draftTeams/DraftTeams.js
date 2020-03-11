import React from "react";
import './DraftTeams.css';

export default ({ viewTeamsPlayers, owner, viewNewTeam, ownersList }) => (
  <div className="teamsView">
    <div className="teamsHeader">
      <h2>View teams</h2>
      <select className="teamSelect" onChange={viewNewTeam}>
        {ownersList.map((owner, i) => {
          return (
            <option value={owner.name} key={i}>{owner.name}</option>
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
        {viewTeamsPlayers.map((player, i) => {
          let name = player.name
          name = name.length < 19 ? name : name.slice(0, 16) + '...'

          return (
            <tr key={i}>
              <td className="name">{name}</td>
              <td className="school">{player.team}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
