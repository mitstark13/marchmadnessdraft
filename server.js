const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

// const config = require('./config');


const app = express();


app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const pusher = new Pusher({
  appId: '571516',
  key: '4f19babc17552ecbf634',
  secret: '4949b2024431aec551c9',
  cluster: 'us2',
  encrypted: true
});

app.use(express.static(__dirname + '/build'));

app.get('/admin', function(req, res){
  res.redirect('/');
});

app.get('/draft', function(req, res){
  res.redirect('/');
});

app.get('/review', function(req, res){
  res.redirect('/');
});

app.set('PORT', process.env.PORT || 5000);

MongoClient.connect('mongodb://draftAdmin:password2113@ds131826.mlab.com:31826/new-db-starkey', (err, database) => {
// MongoClient.connect('mongodb://127.0.0.1:27017/marchmadness', (err, database) => {
  if (err) return console.log(err)

  app.listen(app.get('PORT'), () =>  {
    console.log('Listening at ' + app.get('PORT'))

    app.get('/players', (req, res) => {
      //Sort puts the document with the owners list first
      database.collection('players').find().sort( { seedList: -1 } ).toArray(function(err, array) {
        if (err) return console.log(err)

        res.send(array)
      })
    })

    app.get('/leagues', (req, res) => {
      //Sort puts the document with the owners list first
      database.collection('leagues').find().toArray(function(err, array) {
        if (err) return console.log(err)

        res.send(array)
      })
    })

    app.put('/currentPick', (req, res) => {
      database.collection('players')
      .updateMany({currentPick: { $gt: 0 }}, { //resets all to no owner and no pickNumber
        $inc: {
          currentPick: 1
        },
        $set: {
          lastPick: req.body.dateNow
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        console.log('successful reset')
      })
    })

    app.put('/marchmadness', (req, res) => {
      console.log(req.body)
      database.collection('players')
      .findOneAndUpdate({name: req.body.name}, { //finds the name, updates the following
        $set: {
          owner: req.body.owner,
          pickNumber: req.body.pickNumber.toString()
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        pusher.trigger('draft', 'playerDrafted', result);
        console.log('successful')
      })
    })

    // ***** RESET DB TO START OF DRAFT *****
    app.put('/reset', (req, res) => {
      console.log('resetting db')
      database.collection('players')
      .updateMany({}, { //resets all to no owner and no pickNumber
        $set: {
          owner: "",
          pickNumber: "0",
          currentPick: 1,
          round: 1,
          lastPick: "0"
        }
      }, (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        pusher.trigger('draft', 'draftReset', result);
        console.log('successful reset')
      })
    })
    // **** LEAGUES ****
    // ***** ADMIN PAGE *****
    app.post('/newLeague', (req, res) => {
      database.collection('leagues').save(req.body, (err, result) => {
        if (err) return console.log(err)
        res.send(result)
        console.log('Created new league')
        //ToDo: Add Pusher event to show success message
      })
    })

    // ***** ADMIN PAGE *****
    app.post('/newPlayer', (req, res) => {
      database.collection('players').save(req.body, (err, result) => {
        if (err) return console.log(err)

        //https://docs.mongodb.com/manual/reference/method/db.collection.update/ to update if already exists
    
        console.log('saved new player to database')
        //ToDo: Add Pusher event to show success message
      })
    })

    app.put('/marchmadnessadmin', (req, res) => {
      console.log(req.body)
      database.collection('players')
      .update({name: req.body.name}, {
        name: req.body.name,
        team: req.body.team,
        points: req.body.points,
        rebounds: req.body.rebounds,
        assists: req.body.assists,
        total: req.body.total,
        pickNumber: req.body.pickNumber,
        owner: req.body.owner,
        currentPick: req.body.currentPick,
        lastPick: req.body.lastPick,
      },
      { upsert: true }, //If none exists, create new player
      (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        //TODO: Add Pusher trigger
        pusher.trigger('draft', 'playerDrafted', result);
        console.log('successful')
      })
    })

    app.delete('/deletenullplayers', (req, res) => {
      console.log('Deleting players with null teams')
      database.collection('players').remove({name: { $type : "string" }, team: null},
        (err, result) => {
        if (err) return res.send(err)
        res.send(result)
        console.log('Deleting successful')
      })
    })

    //***** CHAT *****
    app.get('/message', (res) => {
  		console.log(res)
  	})

    app.post('/message', (req, res) => {
      const payload = req.body;
      pusher.trigger('chat', 'message', payload);
      res.send(payload)
    });

    app.post('/users', (req, res) => {
      const payload = req.body;
      pusher.trigger('login', 'users', payload)
      res.send(payload)
    });
  });

})


