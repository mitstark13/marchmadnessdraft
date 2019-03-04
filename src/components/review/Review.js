import React, { Component } from 'react';
import axios from 'axios';
import DraftTeams from '../draft/draftTeams/DraftTeams'

class Review extends Component {
  constructor(props) {
    super(props);

    this.state = {
      players: [],
      ownersList: [],
      owner: ''
    };
  }

  viewNewTeam() {
    const newOwner = document.querySelector('.teamSelect').value;
    this.setState({owner: newOwner})
  }

  resetDraft = () => {
    let payload = "Resetting draft"
    axios.put(this.props.dbUrl + '/reset', payload)
      .then((resp) => {
        alert('Draft reset to pick #1')
      })
  }

  componentDidMount() {

    axios.get(this.props.dbUrl + '/players').then((players) => {
      let draftOrder = players.data[0].owners
      this.setState({ ownersList: draftOrder })
      this.setState({ owner: draftOrder[0] })
      this.setState({ players: players.data })
    });

    this.viewNewTeam = this.viewNewTeam.bind(this);
    this.resetDraft = this.resetDraft.bind(this);
  }

  render() {

  	const draftedOrder = this.state.players
    draftedOrder.sort((a, b) => {
      return Number(b.pickNumber) - Number(a.pickNumber)
    })

    return (
      <section id="draftReview">
        <h1> Draft Review </h1>
        <button onClick={this.resetDraft}> Reset Draft </button>
        <DraftTeams
            players={draftedOrder}
            owner={this.state.owner}
            viewNewTeam={this.viewNewTeam}
            ownersList={this.state.ownersList}
          />
      </section>
    )
  }
}

export default Review;