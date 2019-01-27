import React from "react";
import './DraftTeams.css';

export default ({ players, owner, viewNewTeam }) => (
  <div className="teamsView">
    <div className="teamsHeader">
      <h2>View teams</h2>
      <select className="teamSelect" onChange={viewNewTeam}>
        <option value="Mitchell">Mitchell</option>
        <option value="Nick">Nick</option>
        <option value="Kyle">Kyle</option>
        <option value="Caleb">Caleb</option>
        <option value="Ben">Ben</option>
        <option value="Isaac">Isaac</option>
        <option value="Darian">Darian</option>
        <option value="Deni">Deni</option>
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
