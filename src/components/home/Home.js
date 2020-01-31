import React, {Component} from "react";
import axios from 'axios';
import JoinLeague from '../joinLeague/JoinLeague';
import CreateLeague from '../createLeague/CreateLeague';
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

  render() {
    return(
      <section className="c-home">
        <div className="c-home__wrapper">
          <JoinLeague leagues={this.state.leagues}/>
          <div className="c-home__middle">
            <div className="line"></div>
            <b>OR</b>
            <div className="line"></div>
          </div>
          <CreateLeague />
        </div>
        <footer className="c-home__footer">
          <small>Created by <a href="www.mstark.tech" target="_blank">Mitchell Starkey</a></small>
        </footer>
      </section>
    )
  }
};

export default Home;
