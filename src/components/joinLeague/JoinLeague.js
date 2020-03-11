import React, {Component} from "react";
import axios from 'axios';
// import { Link } from "react-router-dom";
import './JoinLeague.css';

class JoinLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      successfulJoin: false
    };

    this.handlePrivateJoin = this.handlePrivateJoin.bind(this);
  }

  handlePasswordChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handlePrivateJoin = (e) => {
    e.preventDefault();
    console.log(this.state.joinLeaguePassword);
    const joiningLeague = this.state.joiningLeague;

    this.props.leagues.forEach((league) => {
      if (joiningLeague === league._id) {
        console.log(league)
        if (this.state.joinLeaguePassword === league.settings.passphrase) {
          alert("Correct Password! Joining league...");
          this.joinLeague(joiningLeague, league.settings.maxTeams);
        }
      }
    });
  }

  handleJoin = (e) => {
    const privateLeague = e.target.dataset.isprivate
    if (this.props.loggedInUser === 0) {
      this.props.openLoginModal();
    } else if (privateLeague) {
      this.setState({
        joiningPrivate: true,
        joiningLeague: e.target.dataset.league,
      })
    } else {
      this.joinLeague(e.target.dataset.league, e.target.dataset.maxteams);
    }
  }

  joinLeague = (leagueId, maxTeams) => {
    console.log(leagueId, maxTeams);
    axios.post(this.props.dbUrl + '/joinLeague', {
      "leagueId": leagueId,
      "maxTeams": maxTeams,
      "userId": this.props.loggedInUser
    }).then((result) => {
      console.log(result)
    });
  }

  render() {
    return(
    <section className="c-join">
      {this.state.successfulJoin &&
        <div className="c-join__success">
          <p className="c-join__success-text">Successfully joined league!</p>
        </div>
      }
      <h1 className="c-join__headline">Join League</h1>
      <p className="c-join__description">Join existing leagues and beat them at their own game.</p>
      <ul className="c-join__list">
        {this.props.leagues.map((league) => {
        let settings = league.settings;
        let teams = league.teams;
        // let joinLink = "/draft?id=" + league._id
        return (
            <li key={league._id} className="c-join__list-item">
              <span className="c-join__list-name">{settings.name}</span>
              <small className="c-join__list-maxTeams">{teams.length}/{settings.maxTeams}</small>
              {teams.length === settings.maxTeams
                ? <button className="c-join__list-link">Full</button>
                : <button className="c-join__list-link" data-isprivate={settings.privateLeague} data-maxteams={settings.maxTeams} data-league={league._id} onClick={this.handleJoin}>Join</button>
              }
            </li>
        )
        })}
      </ul>

      {this.state.joiningPrivate &&
        <div className="c-private">
          <h2 className="c-private__headline">Private League</h2>
          <p className="c-private__description">This league is private. Enter in the league password below to join.</p>
          <form className="c-private__form" onSubmit={this.handlePrivateJoin}>
            <label className="c-private__label">
              Password
              <input type="text" className="c-private__input" name="joinLeaguePassword" onChange={this.handlePasswordChange} />
            </label>
            <input type="submit" className="c-private__submit" value="Submit"/>
          </form>
        </div>
      }
    </section>
    )
  }
};

export default JoinLeague;