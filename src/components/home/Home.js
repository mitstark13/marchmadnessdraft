import React, {Component} from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      username: 'Human',
      leagues: []
    };
  }

  componentDidMount() {
    console.log(this.props)
    axios.get(this.props.dbUrl + '/leagues').then((leagues) => {
      console.log(leagues.data)
      this.setState({ leagues: leagues.data })
    });
  };

  openCreateLeague() {
    document.querySelector('section.createLeague').classList.toggle('hide');
  }

  render() {
    return(
      <main>
        <section className="home">
          <h1>Draft Leagues</h1>
          <p>Join / Create league below</p>
          <input type="text" />
          <button onClick={this.openCreateLeague}>Create</button>

          <ul>
            {this.state.leagues.map((league) => {
              let joinLink = "/draft?id=" + league._id
              return (
                <li key={league._id}>
                  <span>{league.name}</span>
                  <small>{league.members.length}/{league.maxMembers}</small>
                  <Link to={joinLink}>Join</Link>
                </li>
              )
            })}
          </ul>
        </section>
        <section className="createLeague hide">
          <h2>Create new league</h2>
          <input type="text" name="leagueName" placeholder="League Name" />
          <input type="number" min="4" max="14" defaultValue="4" />
          <input type="radio" name="leaguePrivate" />
          <input type="password" name="leaguePw" placeholder="Password" />
        </section>
        <footer>
          <small>Created by <a href="www.mstark.tech" target="_blank">Mitchell Starkey</a></small>
        </footer>
      </main>
    )
  }
};

export default Home;
