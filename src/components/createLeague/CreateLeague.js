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
      privateLeague: false,
      passphrase: '',
      successfulCreation: false
    };
  }

  onChange = (e) => {
    if (e.target.name === 'privateLeague') {
      this.setState({ [e.target.name]: e.target.checked })
    } else {
      this.setState({ [e.target.name]: e.target.value });
    }
  }

  createLeague = () => {
    const { name,
      maxTeams,
      maxPlayers,
      privateLeague,
      passphrase
    } = this.state;

    axios.post(this.props.dbUrl + '/newLeague', {
      "settings": {
        "date": "",
        name,
        maxTeams,
        maxPlayers,
        privateLeague,
        passphrase,
        currentPick: 1,
        lastPickTime: 0,
        commish: this.props.loggedInUser
      },
      "teams": [
        {
          "userId": this.props.loggedInUser,
          "players": []
        }
      ]
    }).then((result) => {
      console.log(result)
    });
  }

  render() {
    return(
    <section className="c-create">
      {this.state.successfulCreation &&
        <div className="c-create__success">
          <p className="c-create__success-text">Successfully created league!</p>
        </div>
      }
      <h2 className="c-create__headline">Create League</h2>
      <p className="c-create__description">Create and customize your own league.</p>
      <form className="c-create__form" onSubmit={this.createLeague}>
        <label htmlFor="leageName" className="c-create__label">League Name:
          <input type="text" className="c-create__input" placeholder="DreamLeague" name="name" onChange={this.onChange} />
        </label>
        <div className="c-create__flex">
          <div data-am-toggle-switch>
            <span>Private: </span>
            <input type="checkbox" id="input-b" name="privateLeague" onChange={this.onChange} />
            <label htmlFor="input-b"></label>
          </div>
          <input type="password" className="c-create__input" placeholder="Password" name="passphrase" disabled={!this.state.privateLeague} onChange={this.onChange} />
        </div>
        <div className="c-create__flex">
          <label htmlFor="leagueMax" className="c-create__label">Size of league:
            <input type="number" className="c-create__input c-create__input-number" min="4" max="12" placeholder="10" name="maxTeams" onChange={this.onChange} />
          </label>
          <label htmlFor="leaguePlayers" className="c-create__label">Number of rounds:
            <input type="number" className="c-create__input c-create__input-number" min="5" max="15" placeholder="12" name="maxPlayers" onChange={this.onChange} />
          </label>
        </div>
        <input type="submit" className="c-create__button" value="Create League"></input>
      </form>
    </section>
    )
  }
};

export default CreateLeague;