import React, { Component } from 'react';
import {withRouter} from 'react-router';
import axios from 'axios';
import Pusher from 'pusher-js';
import DraftTable from './draftTable/DraftTable';
import DraftHistory from './draftHistory/DraftHistory';
import DraftTeams from './draftTeams/DraftTeams';
import DraftOrder from './draftOrder/DraftOrder';
import ChatMain from '../chat/ChatMain';
import soundFile from '../../music/mmMusic.mp3';

class Draft extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      teamViewOwner: '',
      players: [],
      thisLeague: {},
      ownersList: [],
      draftOrder: [],
      currentPick: 1,
      round: 1,
      maxRounds: 10,
      autopick: false,
      lastDraftTime: 0,
      selectedPlayer: {},
      seedList: {},
      filterTeam: '',
      filterSeedMin: 0,
      filterSeedMax: 16,
      filterByProj: false
    };
  }

  componentDidMount() {

    const pusher = new Pusher('4f19babc17552ecbf634', {
      cluster: 'us2',
      encrypted: true
    });

    if (this.audio) {
      this.audio.pause()
    }

    this.audio = new Audio(soundFile)

    const savedUser = sessionStorage.getItem('loginUsername');
    this.setState({
      username: savedUser
    })

    if (savedUser === "") {
      window.location.pathname = '/'
    }

    this.viewNewTeam = this.viewNewTeam.bind(this);
    this.countdownVar = true;

    axios.get(this.props.dbUrl + '/ncaa').then((ncaa) => {
      this.setState({ seedList: ncaa.data[0].seedList })
    });

    axios.get(this.props.dbUrl + '/players').then((players) => {
      this.setState({ players: players.data })
      this.setState({ selectedPlayer: players.data[Math.floor(Math.random() * Math.floor(players.data.length - 1))]})
      this.setTeamsDropdown();
      this.getDraftOrder();
      // this.playMusic();
      // this.countdownInterval = setInterval(() => { this.getCountdown() }, 1000);
    });

    // axios.get(this.props.dbUrl + '/leagues').then((leagues) => {
    //   console.log(leagues);
    //   leagues = leagues.data;
    //   const leagueId = this.props.match.params.id;
    //   const thisLeague = leagues.filter(function(league) { return league._id === leagueId })
    //   console.log(thisLeague);
    //   this.setState({ thisLeague: thisLeague[0] });
    // }).then(() => {
    //   this.getLeagueSettings();
    //   this.playerDrafted(pusher);
    // })

    // this.countdownInterval = setInterval(() => { if (this.countdownVar) this.getCountdown() }, 1000);
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

  // playMusic() {
  //   const owner = document.querySelector('.orderOwner.active .name').innerText;

  //   if (owner === this.state.username) {

  //     if (!this.audio) return

  //     this.audio.currentTime = 10 //perfect timing
  //     this.audio.volume = 0.2 //quiet for testing
  //     this.audio.play()


  //   }
  // }

  stopAudio() {
    if (this.audio) {
      this.audio.pause()
    }
  }

  setTeamsDropdown() {
    let username = this.state.username;
    username = username === "Admin" ? this.state.ownersList[0] : username
    document.querySelector('.teamSelect').value = username
    this.setState({ teamViewOwner: username})
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

  handleSeedFilter(value) {
    let minSeed = Math.floor(value[0]);
    let maxSeed = Math.floor(value[1]);
    this.setState({
      filterSeedMin: minSeed,
      filterSeedMax: maxSeed
    })

    document.querySelector('.noUi-handle.noUi-handle-lower').innerHTML = "<span>" + minSeed + "</span>";
    document.querySelector('.noUi-handle.noUi-handle-upper').innerHTML = "<span>" + maxSeed + "</span>";
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
      //this.draftPlayer(); Autopick currently turned off. We talk too much and don't care about the countdown

      seconds_left = 0 // To keep from showing negative numbers when autopick is turned off
      // TODO: Create annoyDrafter() to hurry up the draft so it doesn't take 4 hours like last year
      this.annoyDrafter();
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

  annoyDrafter() {
    let countdownWrapper = document.querySelector('#countdown');
    countdownWrapper.classList.add('draftWarning');
  }

  getDraftOrder() {
    let round = this.state.round;
    let ownersList = [...this.state.ownersList];
    let owners = [...ownersList, ...ownersList.reverse()];
    let draftingIdx = (this.state.currentPick - 1) % (owners.length);

    if (draftingIdx * 2 < owners.length) {
      owners = [...ownersList.reverse(), round, ...ownersList.reverse()];
      if (draftingIdx * 2 === owners.length - 1) {
        draftingIdx+=1
      }
    }

    if (round >= this.state.maxRounds) {
      owners = owners.slice(draftingIdx, draftingIdx + 7)
    }

    if (owners.length - draftingIdx > 7) {
      owners = owners.slice(draftingIdx, draftingIdx + 7)
    } else {
      if (round < this.state.maxRounds) {
        owners = [...owners.slice(draftingIdx, owners.length), round, ...owners.slice(0, 7 - (owners.length - draftingIdx))]
      }
    }

    this.setState({draftOrder: owners})

  }

  playerDrafted(pusher) {
    let pusherChannel = `draft-${this.state.thisLeague._id}`;
    const channel = pusher.subscribe(pusherChannel);
    channel.bind('playerDrafted', data => {
      console.log(data);
      const nameDrafted = data.value.name;
      console.log(nameDrafted + " has been drafted!")
      this.stopAudio()
      
      let pickNum = this.state.currentPick
      pickNum+=1

      this.setState({ currentPick: pickNum});
      this.setState({ lastDraftTime: new Date().getTime() })
      this.testIfDraftEnded(this.state.ownersList.length, this.state.currentPick);
      // this.playMusic();
      let countdownWrapper = document.querySelector('#countdown');
      countdownWrapper.classList.remove('draftWarning');
    });
  }

  viewNewTeam() {
    const newOwner = document.querySelector('.teamSelect').value;
    this.setState({teamViewOwner: newOwner})
  }

  selectPlayer(player) {
    if (player.pickNumber === '0') {
      this.setState({selectedPlayer: player})
    }
  }

  draftPlayer() {
    const name = document.querySelector('.draftName p').innerHTML;
    const team = document.querySelector('.draftName small').innerHTML;
    let owner = document.querySelector('.orderOwner.active span.name').innerHTML;
    const pickNumber = this.state.currentPick;
    const players = this.state.players;
    let ownersList = [...this.state.ownersList];
    const ownerIdx = ownersList.findIndex(x => x.name === owner);
    const ownerId = ownersList[ownerIdx].userId;
    ownersList[ownerIdx].players.push({name, team, pickNumber});
    const dateNow = new Date().getTime();

    if (owner === this.state.username || this.state.username === 'Hoosier' || this.state.autopick) {
      const payload = {
        name,
        team,
        owner,
        pickNumber,
        dateNow,
        userId: ownerId,
        leagueId: this.state.thisLeague._id
        // teamId
      }

      axios.put(this.props.dbUrl + '/marchmadness', payload)
      
      let newPlayer = "";
      while (newPlayer === "") {
        let option = players[Math.floor(Math.random() * Math.floor(players.length - 1)) + 1]
        newPlayer = option
      }

      let roundNum = Math.floor(pickNumber / ownersList.length) + 1
      this.setState({round: roundNum})

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
    const draftedOrder = []

    if (this.state.thisLeague.teams) {
      this.state.thisLeague.teams.forEach(function (team) {
        const owner = team.name;
        team.players.map((player) => {
          player.owner = owner
          draftedOrder.push(player);
          return player;
        })
      })
      draftedOrder.sort((a, b) => {
        return Number(b.pickNumber) - Number(a.pickNumber)
      })
    }

    const viewTeamsPlayers = [];

    this.state.ownersList.forEach((ownerObj, i) => {
      let team = ownerObj.players;
      
      if (team && ownerObj.name === this.state.teamViewOwner) {
        team.forEach((player, i) => {
          viewTeamsPlayers.push({
            name: player.name,
            team: player.team
          })
        })
      } else {
        return false;
      }
    })

    return (
      <React.Fragment>
        <section id="draftWrapper">
          <section id="draftOrder">
            <DraftOrder owners={this.state.draftOrder} pickNumber={this.state.currentPick} />
          </section>
          
          <section id="draft">
            <DraftTable
              players={this.state.players}
              draftedOrder={draftedOrder}
              seedList={this.state.seedList}
              selectedPlayer={this.state.selectedPlayer}
              draftPlayer={this.draftPlayer.bind(this)}
              filterTeam={this.state.filterTeam}
              filterSeedMin={this.state.filterSeedMin}
              filterSeedMax={this.state.filterSeedMax}
              filterByProj={this.state.filterByProj}
              handleTeamFilter={this.handleTeamFilter.bind(this)}
              handleSeedFilter={this.handleSeedFilter.bind(this)}
              handleAvailableFilter={this.handleAvailableFilter.bind(this)}
              selectPlayer={this.selectPlayer.bind(this)}/>
            <DraftHistory players={draftedOrder}/>
            <DraftTeams
              viewTeamsPlayers={viewTeamsPlayers}
              owner={this.state.teamViewOwner}
              viewNewTeam={this.viewNewTeam}
              ownersList={this.state.ownersList}
            />
          </section>
        </section>
        <ChatMain
          dbUrl={this.props.dbUrl}
          leagueId={this.state.thisLeague._id}
        />
      </React.Fragment>
    )
  }
};

export default withRouter(Draft);