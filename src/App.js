import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from 'axios';
import Pusher from 'pusher-js';
import ChatList from './components/chat/ChatList';
import ChatBox from './components/chat/ChatBox';
import LoginScreen from './components/login/LoginScreen';
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
      players: [],
      ownersList: [],
      teamNames: [
        'Jedi Padawans',
        'The Three Musketeers',
        'St Louis',
        'CK/KC',
        'I.W.O.Y.B.Y.A.R.T.A.I',
        "One and Done's",
        'Sith Lords',
        'In The Bagley',
        'Team Noah'
      ],
      draftOrder: [],
      currentPick: 1,
      round: 2,
      owner: 'Mitchell',
      lastDraftTime: ''
    };
  }

  componentDidMount() {
    //this.loginUser();

    const pusher = new Pusher('4f19babc17552ecbf634', {
      cluster: 'us2',
      encrypted: true
    });

    // this.pusherChat(pusher);
    this.pusherLogin(pusher);
    // this.playerDrafted(pusher);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    // this.viewNewTeam = this.viewNewTeam.bind(this);

    // const payload = [
    //   this.state.username
    // ];

    axios.get(this.props.dbUrl + '/players').then((players) => {
      console.log(players.data)
      let draftOrder = [...players.data[0].owners, ...players.data[0].owners.reverse()]
      this.setState({ ownersList: draftOrder })
    });
    // axios.post(this.props.dbUrl + '/users', payload);
  }

  pusherChat(pusher) {
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
    });
  }

  pusherLogin(pusher) {
    const channel = pusher.subscribe('login');
    channel.bind('users', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
    })
  }

  ownerLogin(owner) {
    console.log(owner);

    this.setState({ username: owner })

    let loginModal = document.querySelector('section#login');
    loginModal.style.opacity = 0;
    setTimeout(() => {
      loginModal.style.display = 'none';
    }, 500);
  }

  loginUser() {
    const username = window.prompt('Username: ', 'Anonymous');
    
    this.setState({ username });
    this.setState({ users: [...this.state.users, username]})
  }

  handleTextChange(e) {
    if (e.keyCode === 13) {
      this.submitMessage();
    } else {
      this.setState({ text: e.target.value });
    }
  }

  submitMessage() {
    const payload = {
      username: this.state.username,
      message: this.state.text
    };
    axios.post(this.props.dbUrl + '/message', payload);
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App-name">
              <h1 className="App-title">Fantasy Draft 2019</h1>
              <a className="App-bracket" href="http://www.espn.com/mens-college-basketball/bracketology" alt="Bracket Link" target="_blank" rel="noopener noreferrer">View Current Bracket</a>
            </div>
            <div className="App-user">
              <p>Welcome, {this.state.username}</p>
            </div>
          </header>
          
          <Route path="/draft"
            render={(props) => <Draft dbUrl={this.props.dbUrl} username={this.state.username} /> } />
          
          <Route path="/admin"
            render={(props) => <Admin dbUrl={this.props.dbUrl} /> } />

          <Route path="/review"
            render={(props) => <Review dbUrl={this.props.dbUrl} /> } />
          
          <section id="chat">
            <ChatList chats={this.state.chats} />
            <ChatBox
              text={this.state.text}
              username={this.state.username}
              handleTextChange={this.handleTextChange}
              submitMessage={this.submitMessage}
            />
          </section>

          <Route exact path="/"
            render={(props) => <LoginScreen ownerLogin={this.ownerLogin.bind(this)} teamNames={this.state.teamNames} owners={this.state.ownersList.slice(0, this.state.ownersList.length / 2)}/>}
          />
          
        </div>
      </Router>
    );
  }
}

export default App;
