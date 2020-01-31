import React, {Component} from "react";
import './CreateLeague.css';

class CreateLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  render() {
    return(
    <section className="c-home__create">
      <h2 className="c-home__headline">Create League</h2>
      <p className="c-home__description">Create and customize your own league.</p>
      <p className="c-home__description">Make private and invite your family and friends.</p>
      <label htmlFor="leageName">League Name:</label>
      <input type="text" name="leagueName" placeholder="DreamLeague" />
      <label htmlFor="leaguePrivate">Make Private:</label>
      <input type="checkbox" name="leaguePrivate" />
      <label htmlFor="leaguePw">Password to join your league:</label>
      <input type="password" name="leaguePw" placeholder="Password" />
      <label htmlFor="leagueMax">Max size of league:</label>
      <input type="number" name="leageMax" min="2" max="12" />
      <label htmlFor="leaguePlayers">Number of players to draft:</label>
      <input type="number" name="leageMax" min="7" max="15" />
    </section>
    )
  }
};

export default CreateLeague;