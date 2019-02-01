import React, { Component } from "react";
import './DraftTable.css';

class DraftTable extends Component {

  render() {
    // Sort players so best available is on top
    let sortedPlayers = [...this.props.players]
    const {name, team, rebounds, assists, total, points} = this.props.selectedPlayer;
    const id = this.props.selectedPlayer._id;
    const filterTeam = this.props.filterTeam;

    sortedPlayers.sort((a, b) => b.total - a.total)

    return (
      <div className="draftContainer">
        <div className="draftPreview">
          <div className="draftPlayer">
            <div className="draftName">
              <p>{name ? name : "Nick Starkey"}</p>
              <p>{team ? team : "Lebanon"}</p>
            </div>
            <div className="stats pts">
              <p>PTS</p>
              <span>{points ? points : "0"}</span>
            </div>
            <div className="stats rebs">
              <p>REBS</p>
              <span>{rebounds ? rebounds : "0"}</span>
            </div>
            <div className="stats ast">
              <p>AST</p>
              <span>{assists ? assists : "0"}</span>
            </div>
            <div className="stats total">
              <p>Total</p>
              <span>{total ? total : "0"}</span>
            </div>
          </div>
          <button data-id={id ? id : '1234'} onClick={this.props.draftPlayer}>Draft Player</button>
        </div>

        <span>Search name or team: </span>
        <input type="text" className="teamFilter" placeholder="" onChange={this.props.handleTeamFilter} />

        <table className="draftTable">
          <thead className="draftHeader">
            <tr>
              <th className="name">Name</th>
              <th className="school">School</th>
              <th className="pts">Points</th>
              <th className="reb">Rebounds</th>
              <th className="ast">Assists</th>
              <th className="total">Total</th>
            </tr>
          </thead>
          <tbody>
          {sortedPlayers.map((player, i) => {
            const picked = Number(player.pickNumber) > 0;
            const playerLink = "http://www.espn.com/search/results?q=" + player.name
            if ((player.name && player.owner.length < 1) && (filterTeam === '' || player.team.toLowerCase().includes(filterTeam.toLowerCase()) || player.name.toLowerCase().includes(filterTeam.toLowerCase()))) {
              return (
                <tr key={i} data-picked={picked} onClick={() => {this.props.selectPlayer(player)}}>
                  <td className="name"><a href={playerLink} target="_blank">{player.name}</a></td>
                  <td className="school">{player.team}</td>
                  <td className="pts">{player.points}</td>
                  <td className="reb">{player.rebounds}</td>
                  <td className="ast">{player.assists}</td>
                  <td className="total">{player.total}</td>
                </tr>
              );
            } else {
              return false
            }
          })}
          </tbody>
        </table>
      </div>
    )
  }
};

export default DraftTable;
