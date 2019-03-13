import React, { Component } from 'react';
import axios from 'axios';
import './admin.css';
import * as XLSX from 'xlsjs';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      team: '',
      points: '',
      rebounds: '',
      assists: '',
      total: '',
      pickNumber: '0',
      owner: '',
      currentPick: 1,
      lastPick: '0',
      oFile: ''
    };
  }

  deleteNull = () => {
    axios.delete(this.props.dbUrl + '/deletenullplayers')
      .then((result) => {
        console.log(result)
      })
  }

  postPlayer = () => {
    const { name, team, points, rebounds, assists, total, pickNumber, owner, currentPick, lastPick } = this.state;

    axios.put(this.props.dbUrl + '/marchmadnessadmin', { name, team, points, rebounds, assists, total, pickNumber, owner, currentPick, lastPick })
      .then((result) => {
        console.log(result)
      });
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.postPlayer();
  }

  resetDraft = () => {
    let confirmation = window.confirm("Are you sure? All progress will be lost unless Nick made an Excel sheet");
    if (confirmation) {
      let payload = "Resetting draft"
      axios.put(this.props.dbUrl + '/reset', payload)
        .then((resp) => {
          alert('Draft reset to pick #1')
        })
    }
  }

  filePicked = (oEvent) => {
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    console.log(sFilename + ' Uploaded');

    this.setState({'oFile': oFile})
  }

  uploadTeam = () => {
    let oFile = this.state.oFile;
    var reader = new FileReader();
    let teamName = document.querySelector("input[name='teamName']").value

    reader.onload = function(evt) {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, {type:'binary'});
      // Get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      console.log(ws)
      let numPlayers = Math.round((Object.keys(ws).length + 3) / 26);
      console.log('Number of players: ' + numPlayers)

      for (let i = 2; i <= numPlayers; i++) {
        this.setState({ 'name': ws['B' + i].v})
        this.setState({ 'team': teamName})
        this.setState({ 'rebounds': ws['T' + i].v})
        this.setState({ 'assists': ws['U' + i].v})
        this.setState({ 'points': ws['Z' + i].v})
        this.setState({ 'total': Math.round( (ws['T' + i].v + ws['U' + i].v + ws['Z' + i].v) * 10 ) / 10 }) //Math fixes common JS decimal errors

        this.postPlayer();
      }

      alert(teamName + ' has been uploaded!')
    }.bind(this);

    if ((oFile !== '') || (teamName === '')) {
      // Tell JS To Start Reading The File
      reader.readAsBinaryString(oFile);
    } else {
      alert("Please upload an excel file and put a team name")
    }
  }

  render() {
    return (
      <div className="draftHistory">
        <h1>Admin Page</h1>

        <form onSubmit={this.onSubmit} >
          <input type="text" placeholder="name" name="name" onChange={this.onChange}/>
          <input type="text" placeholder="team" name="team" onChange={this.onChange}/>
          <input type="text" placeholder="points" name="points" onChange={this.onChange}/>
          <input type="text" placeholder="rebounds" name="rebounds" onChange={this.onChange}/>
          <input type="text" placeholder="assists" name="assists" onChange={this.onChange}/>
          <input type="text" placeholder="total" name="total" onChange={this.onChange}/>
          <button type="submit">Submit</button>
        </form>

        <div className="fullTeamWrapper">
          <input type="text" placeholder="Team Name" name="teamName" />
          <input type="file" id="my_file_input" onChange={this.filePicked} />
          <button className="uploadExcelTeam" onClick={this.uploadTeam}>Upload Full Team</button>
          <div id='my_file_output'></div>
        </div>

        <br/>
        <button className="deleteBlank" onClick={this.deleteNull}>Delete bad uploads</button>
        <br/>
        <button className="deleteBlank" onClick={this.resetDraft}>Reset Draft</button>

      </div>
    )
  }
};

export default Admin;