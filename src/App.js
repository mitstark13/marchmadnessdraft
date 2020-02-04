import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
// import axios from 'axios';
// import cheerio from 'cheerio';
// import Pusher from 'pusher-js';
// import ChatList from './components/chat/ChatList';
// import ChatBox from './components/chat/ChatBox';
import Home from './components/home/Home';
import Admin from './components/admin/Admin';
import Draft from './components/draft/Draft';
import Review from './components/review/Review';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      username: '',
      chats: [],
      ownersList: []
    };
  }

  componentDidMount() {

    // const pusher = new Pusher('4f19babc17552ecbf634', {
    //   cluster: 'us2',
    //   encrypted: true
    // });

    // this.pusherChat(pusher);
    // this.pusherLogin(pusher);
    // this.draftReset(pusher);

    // this.handleTextChange = this.handleTextChange.bind(this);
    // this.submitMessage = this.submitMessage.bind(this);
    // this.ownerLogin = this.ownerLogin.bind(this);

    // axios.get(this.props.dbUrl + '/players').then((players) => {
    //   let draftOrder = [...players.data[0].owners, ...players.data[0].owners.reverse()]
    //   this.setState({ teamNames: players.data[0].teamNames })
    //   this.setState({ ownersList: draftOrder })
    // });

    // this.getAllGames();
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

  updateScroll() {
    var element = document.querySelector(".draftChat");
    element.scrollTop = element.scrollHeight;
  }

  // pusherChat(pusher) {
  //   const channel = pusher.subscribe('chat');
  //   channel.bind('message', data => {
  //     this.setState({ chats: [...this.state.chats, data], test: '' });
  //     setTimeout(this.updateScroll, 500);
  //   });
  // }

  // pusherLogin(pusher) {
  //   const channel = pusher.subscribe('login');
  //   channel.bind('users', data => {
  //     this.setState({ chats: [...this.state.chats, data], test: '' });
  //   })
  // }

  draftReset(pusher) {
    const channel = pusher.subscribe('draft');
    channel.bind('draftReset', data => {
      window.location.reload();
    })
  }

  // ownerLogin(owner) {

  //   this.setState({ username: owner })

  //   let loginModal = document.querySelector('section#login');
  //   loginModal.style.opacity = 0;
  //   setTimeout(() => {
  //     loginModal.style.display = 'none';
  //   }, 500);

  //   const payload = {
  //     username: '',
  //     message: owner + ' has entered the draft'
  //   };

  //   axios.post(this.props.dbUrl + '/users', payload);
  // }

  // loginUser() {
  //   const username = window.prompt('Username: ', 'Anonymous');
    
  //   this.setState({ username });
  //   this.setState({ users: [...this.state.users, username]})
  // }

  // handleTextChange(e) {
  //   if (e.keyCode === 13) {
  //     this.submitMessage();
  //   } else {
  //     this.setState({ text: e.target.value });
  //   }
  // }

  // submitMessage() {
  //   const payload = {
  //     username: this.state.username,
  //     message: this.state.text
  //   };
  //   axios.post(this.props.dbUrl + '/message', payload);

  //   this.setState({text: ''})
  // }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App-name">
              <Link to="/">
                <h1 className="App-title">Fantasy Draft 2020</h1>
              </Link>
              <a className="App-bracket" href="http://www.espn.com/mens-college-basketball/bracketology" alt="Bracket Link" target="_blank" rel="noopener noreferrer">
                <button>View Current Bracket</button>
              </a>
              {/* <Link to='/admin'>
                <button>Admin Page</button>
              </Link> */}
              {/* <Link to='/review'>
                <button>Draft Review</button>
              </Link> */}
            </div>
            <div className="App-user">
              <p>{this.state.username !== '' ? "Welcome, " + this.state.username : "Sign In"}</p>
            </div>
          </header>
          
          <Route path="/draft"
            render={(props) => <Draft dbUrl={this.props.dbUrl} username={this.state.username} /> } />
          
          <Route path="/admin"
            render={(props) => <Admin dbUrl={this.props.dbUrl} /> } />

          <Route path="/review"
            render={(props) => <Review dbUrl={this.props.dbUrl} /> } />
          
          {/* <section id="chat">
            <ChatList 
              chats={this.state.chats} 
              username={this.state.username}
            />
            <ChatBox
              text={this.state.text}
              username={this.state.username}
              handleTextChange={this.handleTextChange}
              submitMessage={this.submitMessage}
            />
          </section> */}

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

          <Route exact path="/"
            render={(props) => <Home dbUrl={this.props.dbUrl} username={this.state.username} />}
          />
          
        </div>
      </Router>
    );
  }
}

export default App;
