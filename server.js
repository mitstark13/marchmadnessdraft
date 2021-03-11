const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pusher = new Pusher({
  appId: '571516',
  key: '4f19babc17552ecbf634',
  secret: '4949b2024431aec551c9',
  cluster: 'us2',
  encrypted: true
});

app.use(express.static(__dirname + '/build'));

app.get('/admin', function (req, res) {
  res.redirect('/');
});

app.get('/draft', function (req, res) {
  res.redirect('/');
});

app.get('/review', function (req, res) {
  res.redirect('/');
});

app.set('PORT', process.env.PORT || 5000);

const url = 'mongodb://admin:k6PPBPQF4prbN7C6@cluster0-shard-00-00.1tkc4.mongodb.net:27017,cluster0-shard-00-01.1tkc4.mongodb.net:27017,cluster0-shard-00-02.1tkc4.mongodb.net:27017/marchmadness-main?ssl=true&replicaSet=atlas-985tp5-shard-0&authSource=admin&retryWrites=true&w=majority';

MongoClient.connect(url, (err, database) => {
  if (err) return console.log("ERROR: ", err)

  app.listen(app.get('PORT'), () => {
    console.log('Listening at ' + app.get('PORT'))

    app.get('/players', (req, res) => {
      // Returns array of all players
      database.collection('players2020').find().toArray(function (err, array) {
        if (err) return console.log(err)

        res.send(array)
      })
    })

    // app.get('/ncaa', (req, res) => {
    //   //Returns ncaa information such as seed list and injured players
    //   database.collection('all-ncaa').find().toArray(function (err, array) {
    //     if (err) return console.log(err)

    //     res.send(array)
    //   })
    // })

    // app.get('/leagues', (req, res) => {
    //   database.collection('leagues').find().toArray(function (err, array) {
    //     if (err) return console.log(err)

    //     res.send(array)
    //   })
    // })

    app.get('/users', (req, res) => {
      database.collection('users').find().toArray((err, users) => {
        if (err) return console.log(err);

        res.send(users);
      })
    })

    app.post('/login', (req, res) => {
      database.collection('users')
        .findOne({
          email: req.body.email
        })
        .then((loggedInUser) => {
          res.send(loggedInUser);
        })
    })

    app.post('/createUser', (req, res) => {
      database.collection('users')
        .findOne({
          email: req.body.email
        }).then((existingUser) => {
          if (existingUser) {
            res.send({ error: `User with an email of ${existingUser.email} already exists` })
          } else {
            database.collection('users')
              .save(req.body, (err, result) => {
                if (err) return console.log(err)
                res.send(result)
                console.log('Created new user')
              })
          }
        })
    })

    app.put('/marchmadness', (req, res) => {
      console.log(req.body)
      database.collection('leagues')
        .findOneAndUpdate({ 
          _id: ObjectId(req.body.leagueId),
          "teams.userId": req.body.userId
        }, { //finds the name, updates the following
          $set: {
            "settings.currentPick": Number(req.body.pickNumber) + 1,
          },
          $addToSet: {
            "teams.$.players": {
              name: req.body.name,
              team: req.body.team,
              pickNumber: req.body.pickNumber
            }
          }
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
          let pusherChannel = `draft-${req.body.leagueId}`;
          console.log(pusherChannel);
          pusher.trigger(pusherChannel, 'playerDrafted', result);
          console.log('successful')
        })
    })

    // ***** RESET DB TO START OF DRAFT *****
    app.put('/reset', (req, res) => {
      console.log('resetting db')
      console.log(req.body.resetLeague);
      database.collection('leagues').findOneAndUpdate({
          _id: ObjectId(req.body.resetLeague)
        }, { //resets all to no owner and no pickNumber
          $set: {
            "settings.currentPick": 1,
            "settings.lastPickTime": 0,
            "teams.$[].players": [],
          },
        }, (err, result) => {
          if (err) return res.send(err)
          res.send(result)
          pusher.trigger('draft', 'draftReset', result);
          console.log('successful reset')
        })
    })
    // **** LEAGUES ****
    // ***** ADMIN PAGE *****
    // app.post('/newLeague', (req, res) => {
    //   database.collection('leagues').save(req.body, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //     console.log('Created new league')
    //   })
    // })

    // *** JOIN LEAGUE
    // app.post('/joinLeague', (req, res) => {
    //   database.collection('leagues').findOneAndUpdate({
    //     "_id": ObjectId(req.body.leagueId),
    //     $where: function() {
    //       return (this.teams.length < req.body.maxTeams )
    //     }}, { //finds the league, checks if max teams have joined
    //     $addToSet: { // $addToSet wont add if userId already exists. $push will.
    //       teams: {
    //         userId: req.body.userId,
    //         players: []
    //       }
    //     }
    //   }, (err, result) => {
    //     if (err) return console.log(err)
    //     res.send(result)
    //     console.log('Joined league')
    //   })
    // })

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
      database.collection('players2020')
        .update({ name: req.body.name }, {
          name: req.body.name,
          team: req.body.team,
          teamShort: req.body.teamShortName,
          points: req.body.points,
          rebounds: req.body.rebounds,
          assists: req.body.assists,
          total: req.body.total
        },
          { upsert: true }, //If none exists, create new player
          (err, result) => {
            if (err) return res.send(err)
            res.send(result)
            //TODO: Add Pusher trigger
            console.log('successful')
          })
    })

    app.delete('/deletenullplayers', (req, res) => {
      console.log('Deleting players with null teams')
      database.collection('players').remove({ name: { $type: "string" }, team: null },
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
      let chatChannel = `chat-${req.body.leagueId}`
      pusher.trigger(chatChannel, 'message', payload);
      res.send(payload)
    });

    app.post('/users', (req, res) => {
      const payload = req.body;
      pusher.trigger('login', 'users', payload)
      res.send(payload)
    });
  });

})


