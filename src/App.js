import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
// import cheerio from 'cheerio';
import Home from './components/home/Home';
import Admin from './components/admin/Admin';
import Draft from './components/draft/Draft';
import Review from './components/review/Review';
import LoginModal from './components/login/LoginModal';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      userName: '',
      loggedInID: 0,
      viewingLeagues: false,
      loggingIn: false,
      chats: [],
      leagues: [],
      ownersList: [],
      usersLeagues: []
    };

    this.openLoginModal = this.openLoginModal.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);
  }

  componentDidMount() {

    const savedUser = sessionStorage.getItem('loginId');
    const savedUsername = sessionStorage.getItem('loginUsername');

    axios.get(this.props.dbUrl + '/leagues').then((leagues) => {
      this.setState({ leagues: leagues.data })
    }).then(() => {
      if (savedUsername) {
        this.handleLogin({
          _id: savedUser,
          username: savedUsername
        })

        this.getLeaguesByUser(savedUser);
      }
    });

    // this.getAllGames();
  }

  getLeaguesByUser = (userId) => {
    let usersLeagues = [];
    this.state.leagues.forEach((league) => {
      if (league.teams.filter(function(team) { return team.userId === userId }).length > 0) {
        usersLeagues.push(league);
      }
    });

    this.setState({
      usersLeagues: usersLeagues
    })
  }

  // getAllGames() {
  //   let gameIds = []
  //   axios.get('http://www.espn.com/mens-college-basketball/tournament/bracket')
  //     .then((html) => {
  //       const $ = cheerio.load(html.data);

  //       $('.match dd').each((i, match) => {
  //         const game = match

  //         if (game.attribs) {
  //           let gameId = game.attribs.onclick.split('(')[1].split(',')[0]
  //           gameIds.push(gameId)
  //         }
  //       })
  //     }).then(() => {
  //       this.getGameData(gameIds)
  //     })
  // }

  // getGameData(ids) {
  //   console.log(ids)
  //   let names = [];
  //   let points = [];
  //   let rebounds = [];
  //   let assists = [];

  //   axios.get('http://www.espn.com/mens-college-basketball/boxscore?gameId=' + ids[0])
  //     .then((html) => {
  //       const $ = cheerio.load(html.data);

  //       //REWRITE THIS TO DO ALL ONE PLAYER AT ONCE AND SAVE AS OBJECT WITH NAME AS KEY
  //       //CAN BE DONE LIKE THIS: $(result).children('td.date');

  //       $('.content.desktop table.mod-data tbody .name span:first-child').each((i, name) => {
  //         console.log(name)
  //         if (name.children[0]) {
  //           let playerName = name.children[0].data
  //           names.push(playerName)
  //         }
  //       })

  //       $('.content.desktop table.mod-data tbody .pts').each((i, name) => {
  //         console.log(name)
  //         if (name.children[0]) {
  //           let pointsTotal = name.children[0].data
  //           points.push(pointsTotal)
  //         }
  //       })

  //       $('.content.desktop table.mod-data tbody .reb').each((i, name) => {
  //         console.log(name)
  //         if (name.children[0]) {
  //           let rebTotal = name.children[0].data
  //           rebounds.push(rebTotal)
  //         }
  //       })
  //       $('.content.desktop table.mod-data tbody .ast').each((i, name) => {
  //         console.log(name)
  //         if (name.children[0]) {
  //           let astTotal = name.children[0].data
  //           assists.push(astTotal)
  //         }
  //       })
  //     })
  //     .then(() => {
  //       console.log(names)
  //       console.log(points)
  //       console.log(rebounds)
  //       console.log(assists)
  //     })
  // }

  draftReset(pusher) {
    const channel = pusher.subscribe('draft');
    channel.bind('draftReset', data => {
      window.location.reload();
    })
  }

  openLoginModal() {
    this.setState({ loggingIn: true });
  }

  closeLoginModal() {
    this.setState({ loggingIn: false });
  }

  handleLogin(user) {
    this.setState({
      loggedInID: user._id,
      userName: user.username,
      loggingIn: false
    })

    this.getLeaguesByUser(user._id);
  }

  mouseEnter = () => {
    this.setState({
      viewingLeagues: true
    })
  }

  mouseLeave = () => {
    this.setState({
      viewingLeagues: false
    })
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <nav className="c-app__nav">
              <Link to="/">
                <h1 className="App-title">Fantasy Draft 2020</h1>
              </Link>
              <ul className="c-app__nav-list">
                <li className="c-app__nav-item">
                  <a className="App-bracket" href="http://www.espn.com/mens-college-basketball/bracketology" alt="Bracket Link" target="_blank" rel="noopener noreferrer">
                    <button>View Current Bracket</button>
                  </a>
                </li>
                {/* <Link to='/admin'>
                  <button>Admin Page</button>
                </Link> */}
                {/* <Link to='/review'>
                  <button>Draft Review</button>
                </Link> */}

                {this.state.userName !== '' &&
                <li className="c-app__nav-item" onMouseEnter={this.mouseEnter}>
                  My leagues <span className="c-app__caret">&#9660;</span>
                  <ul className={this.state.viewingLeagues ? "c-app__submenu dropdown" : "c-app__submenu"} onMouseLeave={this.mouseLeave}>
                    {this.state.usersLeagues.map((league, idx) => {
                      return (
                        <li key={idx}>
                          <Link to={{
                            pathname: `/draft/${league._id}`,
                          }}>{league.settings.name}</Link>
                        </li>
                      )
                    })}
                  </ul>
                </li>
                }
              </ul>
            </nav>
            <div className="App-user">
              {this.state.userName !== ''
              ? <p>{"Welcome, " + this.state.userName}</p>
              : <button onClick={this.openLoginModal}>Sign In</button>
              }
            </div>
          </header>

          <Route exact path="/"
            render={(props) => <Home dbUrl={this.props.dbUrl} leagues={this.state.leagues} openLoginModal={this.openLoginModal} loggedInUser={this.state.loggedInID} username={this.state.userName} />} />
          
          <Route path="/draft/:id"
            render={(props) => <Draft dbUrl={this.props.dbUrl} usersleagues={this.state.usersLeagues} username={this.state.userName} /> } />
          
          <Route path="/admin"
            render={(props) => <Admin dbUrl={this.props.dbUrl} /> } />

          <Route path="/review"
            render={(props) => <Review dbUrl={this.props.dbUrl} /> } />

          {this.state.loggingIn
            ? <LoginModal dbUrl={this.props.dbUrl} closeLoginModal={this.closeLoginModal.bind(this)} handleLogin={this.handleLogin.bind(this)} />
            : <div></div>
          }

          <div className="mobile-menu">
            <a className="App-bracket" href="http://www.espn.com/mens-college-basketball/bracketology" alt="Bracket Link" target="_blank" rel="noopener noreferrer">
              <button>View Current Bracket</button>
            </a>
            <Link to='/admin'>
              <button>Admin Page</button>
            </Link>
            {/* <Link to='/review'>
              <button>Draft Review</button>
            </Link> */}
          </div>
          
        </div>
      </Router>
    );
  }
}

export default App;
