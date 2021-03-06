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
      teamShortName: '',
      points: '',
      rebounds: '',
      assists: '',
      total: '',
      oFile: '',
      resetLeague: 0
    };
  }

  deleteNull = () => {
    axios.delete(this.props.dbUrl + '/deletenullplayers')
      .then((result) => {
        console.log(result)
      })
  }

  postPlayer = () => {
    const { name, team, teamShortName, points, rebounds, assists, total } = this.state;

    axios.put(this.props.dbUrl + '/marchmadnessadmin', { name, team, teamShortName, points, rebounds, assists, total })
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

  handleResetLeague = (e) => {
    if (e.keyCode === 13) {
      this.resetDraft();
    } else {
      this.setState({ resetLeague: e.target.value });
    }
  }

  resetDraft = () => {
    let confirmation = window.confirm("Are you sure? All progress will be lost unless Nick made an Excel sheet");
    if (confirmation) {
      let payload = {
        text: "Resetting draft",
        resetLeague: this.state.resetLeague,
      }
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
    let teamName = document.querySelector("input[name='teamName']").value;
    let teamShortName = document.querySelector("input[name='teamShortName'").value;

    reader.onload = function(evt) {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, {type:'binary'});
      // Get first worksheet
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      let numPlayers = Math.round((Object.keys(ws).length + 3) / 26);
      console.log('Number of players: ' + numPlayers)

      for (let i = 2; i <= numPlayers; i++) {
        this.setState({
          'name': ws['B' + i].v,
          'points': ws['Z' + i].v,
          'rebounds': ws['T' + i].v,
          'assists': ws['U' + i].v,
          'total': Math.round( (ws['T' + i].v + ws['U' + i].v + ws['Z' + i].v) * 10 ) / 10, //Math fixes common JS decimal errors
          'team': teamName,
          'teamShortName': teamShortName,
        })

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
          <input type="text" placeholder="Team Acronym" name="teamShortName" />
          <input type="file" id="my_file_input" onChange={this.filePicked} />
          <button className="uploadExcelTeam" onClick={this.uploadTeam}>Upload Full Team</button>
          <div id='my_file_output'></div>
        </div>

        <br/>
        <button className="deleteBlank" onClick={this.deleteNull}>Delete bad uploads</button>
        <br/>
        <input type="text" onChange={this.handleResetLeague} />
        <button className="deleteBlank" onClick={this.resetDraft}>Reset Draft</button>

      </div>
    )
  }
};

export default Admin;