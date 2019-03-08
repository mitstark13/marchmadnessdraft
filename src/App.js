import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
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
      teamNames: [],
      draftOrder: [],
      currentPick: 1,
      round: 2,
      lastDraftTime: ''
    };
  }

  componentDidMount() {

    const pusher = new Pusher('4f19babc17552ecbf634', {
      cluster: 'us2',
      encrypted: true
    });

    this.pusherChat(pusher);
    this.pusherLogin(pusher);
    this.draftReset(pusher);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
    this.ownerLogin = this.ownerLogin.bind(this);

    axios.get(this.props.dbUrl + '/players').then((players) => {
      let draftOrder = [...players.data[0].owners, ...players.data[0].owners.reverse()]
      this.setState({ teamNames: players.data[0].teamNames })
      this.setState({ ownersList: draftOrder })
    });
  }

  pusherChat(pusher) {
    const channel = pusher.subscribe('chat');
    channel.bind('message', data => {
      this.setState({ chats: [data, ...this.state.chats], test: '' });
    });
  }

  pusherLogin(pusher) {
    const channel = pusher.subscribe('login');
    channel.bind('users', data => {
      this.setState({ chats: [data, ...this.state.chats], test: '' });
    })
  }

  draftReset(pusher) {
    const channel = pusher.subscribe('draft');
    channel.bind('draftReset', data => {
      window.location.reload();
    })
  }

  ownerLogin(owner) {

    this.setState({ username: owner })

    let loginModal = document.querySelector('section#login');
    loginModal.style.opacity = 0;
    setTimeout(() => {
      loginModal.style.display = 'none';
    }, 500);

    const payload = {
      username: '',
      message: owner + ' has entered the draft'
    };

    axios.post(this.props.dbUrl + '/users', payload);
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

    this.setState({text: ''})
  }

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <div className="App-name">
              <Link to="/">
                <h1 className="App-title">Fantasy Draft 2019</h1>
              </Link>
              <a className="App-bracket" href="http://www.espn.com/mens-college-basketball/bracketology" alt="Bracket Link" target="_blank" rel="noopener noreferrer">
                <button>View Current Bracket</button>
              </a>
              <Link to='/admin'>
                <button>Admin Page</button>
              </Link>
              <Link to='/review'>
                <button>Draft Review</button>
              </Link>
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
          </section>

          <div className="mobile-menu">
            <a className="App-bracket" href="http://www.espn.com/mens-college-basketball/bracketology" alt="Bracket Link" target="_blank" rel="noopener noreferrer">
              <button>View Current Bracket</button>
            </a>
            <Link to='/admin'>
              <button>Admin Page</button>
            </Link>
            <Link to='/review'>
              <button>Draft Review</button>
            </Link>
          </div>

          <Route exact path="/"
            render={(props) => <LoginScreen ownerLogin={this.ownerLogin.bind(this)} teamNames={this.state.teamNames} owners={this.state.ownersList.slice(0, this.state.ownersList.length / 2)}/>}
          />
          
        </div>
      </Router>
    );
  }
}

export default App;
