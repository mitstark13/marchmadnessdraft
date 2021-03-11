import React, {Component} from "react";
// import axios from 'axios';
import JoinLeague from '../joinLeague/JoinLeague';
import CreateLeague from '../createLeague/CreateLeague';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      username: 'Human'
    };
  }

  componentDidMount() {
    console.log(this.props)
  };

  render() {
    return(
      <section className="c-home">
        <div className="c-home__wrapper">
					
          <JoinLeague leagues={this.props.leagues} openLoginModal={this.props.openLoginModal} loggedInUser={this.props.loggedInUser} dbUrl={this.props.dbUrl} />
          <CreateLeague openLoginModal={this.props.openLoginModal} loggedInUser={this.props.loggedInUser} dbUrl={this.props.dbUrl} />
        </div>
        <footer className="c-home__footer">
          <small>Created by <a href="https://www.mstark.tech" rel="noopener noreferrer" target="_blank">Mitchell Starkey</a></small>
        </footer>
      </section>
    )
  }
};

export default Home;
