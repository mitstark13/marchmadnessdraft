import React, { Component } from 'react';
import axios from 'axios';
import Pusher from 'pusher-js';
import DraftTable from './draftTable/DraftTable';
import DraftHistory from './draftHistory/DraftHistory';
import DraftTeams from './draftTeams/DraftTeams';
import DraftOrder from './draftOrder/DraftOrder';
import soundFile from '../../music/mmMusic.mp3';

class Draft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      teamViewOwner: '',
      players: [],
      ownersList: [],
      draftOrder: [],
      currentPick: 1,
      round: 1,
      maxRounds: 2,
      autopick: false,
      lastDraftTime: '',
      selectedPlayer: {},
      seedList: {},
      filterTeam: '',
      filterByProj: false
    };
  }

  componentDidMount() {
    //this.loginUser();

    const pusher = new Pusher('4f19babc17552ecbf634', {
      cluster: 'us2',
      encrypted: true
    });

    console.log('testing audio');
    if (this.audio) {
      this.audio.pause()
    }

    this.audio = new Audio(soundFile)

    if (this.props.username.length < 1) {
      window.location.pathname = '/'
    }

    this.setState({ username: this.props.username })
    this.setState({ teamViewOwner: document.querySelector('.teamSelect').value})

    this.playerDrafted(pusher);

    this.viewNewTeam = this.viewNewTeam.bind(this);
    this.countdownVar = true;

    axios.get(this.props.dbUrl + '/players').then((players) => {
      let draftOrder = [...players.data[0].owners, ...players.data[0].owners.reverse()]
      this.setState({ lastDraftTime: players.data[0].lastPick })
      this.setState({ round: players.data[0].round })
      this.setState({ seedList: players.data[0].seedList })
      this.setState({ ownersList: draftOrder })
      this.setState({ currentPick: players.data[0].currentPick })
      this.setState({ players: players.data })
      this.setState({ selectedPlayer: players.data[Math.floor(Math.random() * Math.floor(players.data.length - 1))]})
      this.getDraftOrder();
      this.playMusic();
      // this.countdownInterval = setInterval(() => { this.getCountdown() }, 1000);
    });

    this.countdownInterval = setInterval(() => { if (this.countdownVar) this.getCountdown() }, 1000);
  }

  componentWillMount() {
    this.countdownVar = true;
  }

  componentWillUnmount(){
    this.countdownVar = false;
    clearInterval(this.intervalId);

    if (this.audio) {
      this.audio.pause()
    }
  }

  playMusic() {
    let pickNum = this.state.currentPick
    let ownerIdx = pickNum % this.state.ownersList.length
    const owner = ownerIdx <= 0 ? this.state.ownersList[ownerIdx] : this.state.ownersList[ownerIdx-1]

    if (owner === this.state.username || this.state.username === 'Admin') {

      if (!this.audio) return

      this.audio.currentTime = 10 //perfect timing
      this.audio.volume = 0.2 //quiet for testing
      this.audio.play()

    }
  }

  stopAudio() {
    if (this.audio) {
      this.audio.pause()
    }
  }

  testIfDraftEnded(ownersLength, currentPick) {
    if (ownersLength * this.state.maxRounds < currentPick) { //END OF DRAFT. TODO: Animation or something rather than redirecting right away
      window.location.pathname = '/review';
    } else {
      this.getDraftOrder();
    }
  }

  handleTeamFilter() {
    let team = document.querySelector('.teamFilter').value;
    this.setState({filterTeam: team})
  }

  handleAvailableFilter() {
    this.setState({filterByProj: !this.state.filterByProj})
  }
   
  //Countdown Clock

  getCountdown() {
    var countdown = document.getElementById("tiles"); // get tag element
    let twoMinFrom = this.state.lastDraftTime === "0" ? new Date().getTime() : Number(this.state.lastDraftTime)
    var target_date = twoMinFrom + (1000 * 60 * 2); // set the countdown date
    var minutes, seconds; // variables for time units

    // find the amount of "seconds" between now and target
    var current_date = new Date().getTime();
    var seconds_left = (target_date - current_date) / 1000;
    
    if (seconds_left <= 1) {
      this.setState({ autopick: true })
      this.draftPlayer();
    }
    seconds_left = seconds_left % 3600;
        
    minutes = pad( parseInt(seconds_left / 60, 10) );
    seconds = pad( parseInt( seconds_left % 60, 10 ) );

    // format countdown string + set tag value
    if (countdown) {
      countdown.innerHTML = "<span>" + minutes + "</span><span>" + seconds + "</span>"; 
    }
    
    function pad(n) {
      return (n < 10 ? '0' : '') + n;
    }
  }

  getDraftOrder() {
    let owners = this.state.ownersList;
    let round = this.state.round;
    let draftingIdx = (this.state.currentPick - 1) % owners.length;

    if (owners.length - draftingIdx > 7) {
      owners = owners.slice(draftingIdx, draftingIdx + 7)
    } else {
      if (round < this.state.maxRounds) {
        owners = [...owners.slice(draftingIdx, owners.length), round, ...owners.slice(0, 7 - (owners.length - draftingIdx))]
        if (this.state.ownersList.length - draftingIdx <= 1) {
          console.log('New Round started')
          this.setState({ round: this.state.round + 1})
        }
      } else {
        owners = [...owners.slice(draftingIdx, owners.length)]
      }
    }

    this.setState({draftOrder: owners})
  }

  playerDrafted(pusher) {
    const channel = pusher.subscribe('draft');
    channel.bind('playerDrafted', data => {
      const nameDrafted = data.value.name;
      console.log(nameDrafted + " has been drafted!")
      this.stopAudio()
      
      const playersList = this.state.players
      let pickNum = this.state.currentPick
      let ownerIdx = pickNum % this.state.ownersList.length
      const owner = ownerIdx <= 0 ? this.state.ownersList[ownerIdx] : this.state.ownersList[ownerIdx-1]
      const playerIdx = playersList.findIndex(x => x.name === nameDrafted);
      playersList[playerIdx].pickNumber = pickNum
      playersList[playerIdx].owner = owner
      pickNum+=1

      this.setState({ players: playersList });
      this.setState({ currentPick: pickNum});
      this.setState({ lastDraftTime: new Date().getTime() })
      this.testIfDraftEnded(this.state.ownersList.length, this.state.currentPick);
      this.playMusic();
    });
  }

  viewNewTeam() {
    const newOwner = document.querySelector('.teamSelect').value;
    this.setState({teamViewOwner: newOwner})
  }

  selectPlayer(e) {
    if (e.pickNumber === '0') {
      this.setState({selectedPlayer: e})
    }
  }

  draftPlayer() {
    const name = document.querySelector('.draftName p').innerHTML;
    let ownerIdx = this.state.currentPick % (this.state.ownersList.length)
    let owner = this.state.ownersList[ownerIdx-1 < 0 ? 0 : ownerIdx-1]
    const pickNumber = this.state.currentPick
    const players = this.state.players
    const dateNow = new Date().getTime();

    if (owner === this.state.username || this.state.username === 'Admin' || this.state.autopick) {
      const payload = {
        name,
        owner,
        pickNumber,
        dateNow
      }
      axios.put(this.props.dbUrl + '/marchmadness', payload)
      axios.put(this.props.dbUrl + '/currentPick', payload)
      
      let newPlayer = "";
      while (newPlayer === "") {
        let option = players[Math.floor(Math.random() * Math.floor(players.length - 1)) + 1]
        if (option.owner.length < 1) {
          newPlayer = option
        }
      }

      this.setState({ selectedPlayer: newPlayer })
      this.setState({ autopick: false })
    } else {
      this.showDraftError()
    }
  }

  showDraftError() {
    console.log('Not your turn to draft!');
  }

  render() {
    const draftedOrder = this.state.players
    draftedOrder.sort((a, b) => {
      return Number(b.pickNumber) - Number(a.pickNumber)
    })

    return (
      <section id="draftWrapper">
        <section id="draftOrder">
          <DraftOrder owners={this.state.draftOrder} pickNumber={this.state.currentPick} />
        </section>
        
        <section id="draft">
          <DraftTable
            players={this.state.players}
            seedList={this.state.seedList}
            selectedPlayer={this.state.selectedPlayer}
            draftPlayer={this.draftPlayer.bind(this)}
            filterTeam={this.state.filterTeam}
            filterByProj={this.state.filterByProj}
            handleTeamFilter={this.handleTeamFilter.bind(this)}
            handleAvailableFilter={this.handleAvailableFilter.bind(this)}
            selectPlayer={this.selectPlayer.bind(this)}/>
          <DraftHistory players={draftedOrder}/>
          <DraftTeams
            players={draftedOrder}
            owner={this.state.teamViewOwner}
            viewNewTeam={this.viewNewTeam}
          />
        </section>
      </section>
    )
  }
};

export default Draft;