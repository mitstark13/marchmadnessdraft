import React, {Component} from "react";
import { Link } from "react-router-dom";
import './JoinLeague.css';

class JoinLeague extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    };
  }

  render() {
    return(
    <section className="c-join">
        <h1 className="c-join__headline">Join League</h1>
        <p className="c-join__description">Join existing leagues and beat them at their own game.</p>
        <ul className="c-join__list">
            {this.props.leagues.map((league) => {
            let settings = league.settings;
            let teams = league.teams;
            let joinLink = "/draft?id=" + league._id
            return (
                <li key={league._id} className="c-join__list-item">
                <span className="c-join__list-name">{settings.name}</span>
                <small className="c-join__list-maxTeams">{teams.length}/{settings.maxTeams}</small>
                <Link to={joinLink} className="c-join__list-link">Join</Link>
                </li>
            )
            })}
        </ul>
    </section>
    )
  }
};

export default JoinLeague;