import React, { Component } from "react";
import './DraftTable.css';

class DraftTable extends Component {

  render() {
    // Sort players by total so best available is on top.
    let sortedPlayers = this.props.players
    let seedList = this.props.seedList
    const {name, team, rebounds, assists, total, points} = this.props.selectedPlayer;
    const id = this.props.selectedPlayer._id;
    const filterTeam = this.props.filterTeam;

    sortedPlayers.sort((a, b) => {
      
      if (this.props.filterByProj) {
        // *** PLEASE FIND BETTER WAY TO DO THIS. CURRENTLY LAZY ***
        let aTeam = a.team
        let aSeed = seedList[aTeam]
        let aSeedStrength = 1

        let bTeam = b.team
        let bSeed = seedList[bTeam]
        let bSeedStrength = 1

        // Finding projected games to be played, then multiply that to total
        for (let i = 1; i < 9; i+=2) {
          aSeedStrength = aSeed <= i ? aSeedStrength+=1 : aSeedStrength
          bSeedStrength = bSeed <= i ? bSeedStrength+=1 : bSeedStrength
        }

        a.AdjTotal = a.total * aSeedStrength
        b.AdjTotal = b.total * bSeedStrength
      } else {
        [a.AdjTotal, b.AdjTotal] = [a.total, b.total]
      }

      return b.AdjTotal - a.AdjTotal
    })

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
            
            <button data-id={id ? id : '1234'} onClick={this.props.draftPlayer}>Draft Player</button>
          </div>
        </div>

        <div className="tableFilters">
          <div className="teamFilterWrapper">
            <label>Search name or team: </label>
            <input type="text" className="teamFilter" placeholder="" onChange={this.props.handleTeamFilter} />
          </div>

          <div className="bestAvailableWrapper">
            <label>Best Available: </label>
            <input type="checkbox" className="bestAvailableFilter" onChange={this.props.handleAvailableFilter} />
            <div className="bestAvailableInfo">
              <span>?</span>
              <div className="bestAvailableInfoModal">
                <p>"Best Available" will filter based on projected number of games the player will play<span className="warning">Warning: this would have put most of the Virginia players near the top last year...</span></p>
              </div>
            </div>
          </div>
        </div>

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
