import React, { Component } from 'react';
import Pusher from 'pusher-js';
import axios from 'axios';
import ChatList from './ChatList';
import ChatBox from './ChatBox';

class ChatMain extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      text: '',
      chats: []
    };
  }

  componentDidMount() {
    const pusher = new Pusher('4f19babc17552ecbf634', {
      cluster: 'us2',
      encrypted: true
    });

    let leagueId = window.location.pathname.split('draft/')[1];

    this.pusherChat(pusher, leagueId);

    this.ownerLogin = this.ownerLogin.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
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
      message: owner + ' has entered the draft',
      leagueId: this.props.leagueId
    };

    axios.post(this.props.dbUrl + '/users', payload);
  }
  
  pusherChat(pusher, leagueId) {
    let chatChannel = `chat-${leagueId}`
    console.log(chatChannel);
    const channel = pusher.subscribe(chatChannel);
    channel.bind('message', data => {
      this.setState({ chats: [...this.state.chats, data], test: '' });
      setTimeout(this.updateScroll, 500);
    });
  }

  updateScroll() {
    var element = document.querySelector(".draftChat");
    element.scrollTop = element.scrollHeight;
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
      message: this.state.text,
      leagueId: this.props.leagueId
    };
    axios.post(this.props.dbUrl + '/message', payload);

    this.setState({text: ''})
  }

  render() {
    return (
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
    )
  }
};

export default ChatMain;