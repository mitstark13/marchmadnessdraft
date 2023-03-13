import React, { Component } from 'react';
import axios from 'axios';
import '../draft/draftHistory/DraftHistory.css';

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: []
    };
  }
  
  componentDidMount() {

    axios.get(this.props.dbUrl + '/players').then((players) => {
      this.setState({ players: players.data })
    });
    
  }

  render() {

    const draftedOrder = this.state.players
    draftedOrder.sort((a, b) => {
      return Number(a.pickNumber) - Number(b.pickNumber)
    })

    return (
      <section className="draftHistory review">
        <h2> Draft Review </h2>

        <table>
          <thead>
            <tr>
              <th className="pick">#</th>
              <th className="name">Player</th>
              <th className="team">Team</th>
              <th className="owner">Owner</th>
            </tr>
          </thead>
          <tbody>
          {draftedOrder.map((player, i) => {
            const drafted = player.pickNumber > 0

            if (drafted) {
              let name = player.name
              name = name.length < 19 ? name : name.slice(0, 16) + '...'
              
              return (
                <tr key={i}>
                  <td className="pick">{player.pickNumber}</td>
                  <td className="name">{name}</td>
                  <td className="team">{player.team}</td>
                  <td className="owner">{player.owner}</td>
                </tr>
              );
            } else {
              return false
            }
          })}
          </tbody>
        </table>
      </section>
    )
  }
}

export default Review;