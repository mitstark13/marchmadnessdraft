import React, {Component} from "react";
import axios from 'axios';
import './CreateLeague.css';

class CreateLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      maxTeams: '',
      maxPlayers: '',
      publicLeague: true,
      passphrase: '',
      commish: "Mitchell",
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  createLeague = () => {
    const { name,
      maxTeams,
      maxPlayers,
      publicLeague,
      passphrase,
      commish
    } = this.state;

    axios.post(this.props.dbUrl + '/newLeague', {
      "settings": {
        "date": "",
        name,
        maxTeams,
        maxPlayers,
        publicLeague,
        passphrase,
        commish
      },
      "teams": []
    }).then((result) => {
        console.log(result)
      });
  }

  render() {
    return(
    <section className="c-create">
      <h2 className="c-create__headline">Create League</h2>
      <p className="c-create__description">Create and customize your own league.</p>
      <p className="c-create__description">Make private and invite your family and friends.</p>
      <label htmlFor="leageName">League Name:</label>
      <input type="text" placeholder="DreamLeague" name="name" onChange={this.onChange} />
      <label htmlFor="leaguePrivate">Make Private:</label>
      <input type="checkbox" name="publicLeague" onChange={this.onChange} />
      <label htmlFor="leaguePw">Password to join your league:</label>
      <input type="password" placeholder="Password" name="passphrase" onChange={this.onChange} />
      <label htmlFor="leagueMax">Max size of league:</label>
      <input type="number" min="2" max="12" name="maxTeams" onChange={this.onChange} />
      <label htmlFor="leaguePlayers">Number of players to draft:</label>
      <input type="number" min="7" max="15" name="maxPlayers" onChange={this.onChange} />
      <button className="c-create__button" onClick={this.createLeague}>Create League</button>
    </section>
    )
  }
};

export default CreateLeague;