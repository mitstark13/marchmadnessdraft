const Pusher = require('pusher');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

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

app.set('PORT', process.env.PORT || 5050);

const uri = "mongodb+srv://admin:k6PPBPQF4prbN7C6@cluster0.1tkc4.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

client.connect().then(() => {
  app.listen(app.get('PORT'), () =>  {
    console.log('Listening at ' + app.get('PORT'))

    app.get('/players', async (req, res) => {
      //Sort puts the document with the owners list first
      const players = client.db('marchmadness-main').collection('players2023').find();
      const sortedPlayers = await players.sort( { owners: -1 } );
      const allPlayers = await sortedPlayers.toArray();
      res.send(allPlayers);
    })

    app.put('/currentPick', (req, res) => {
      client.db('marchmadness-main').collection('players2023').updateMany({currentPick: { $gt: 0 }}, { //resets all to no owner and no pickNumber
        $inc: {
          currentPick: 1
        },
        $set: {
          lastPick: req.body.dateNow
        }
      }).then((err, result) => {
        if (err) return res.send(err)
        res.send(result);
      });
    })

    app.put('/marchmadness', async (req, res) => {
      const collection = client.db('marchmadness-main').collection('players2023')
      try {
        await collection.findOneAndUpdate({name: req.body.name}, { //finds the name, updates the following
          $set: {
            owner: req.body.owner,
            pickNumber: req.body.pickNumber.toString()
          }
        }).then((result) => {
          res.send(result)
          pusher.trigger('draft', 'playerDrafted', result);
          console.log('successful')
        })
      } catch (err) {
        if (err) return res.send(err)
      }
    })

    // ***** RESET DB TO START OF DRAFT *****
    app.put('/reset', async (req, res) => {
      console.log('resetting db')
      const db = client.db('marchmadness-main').collection('players2023');
      await db.updateMany({}, { //resets all to no owner and no pickNumber
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

    // ***** ADMIN PAGE *****
    app.post('/newPlayer', async (req, res) => {
      const db = client.db('marchmadness-main').collection('players2023');
      await db.save(req.body, (err, result) => {
        if (err) return console.log(err)

        //https://docs.mongodb.com/manual/reference/method/db.collection.update/ to update if already exists
    
        console.log('saved new player to client')
        //ToDo: Add Pusher event to show success message
      })
    })

    app.put('/marchmadnessadmin', async (req, res) => {
      console.log(req.body)
      const db = client.db('marchmadness-main').collection('players2023');
      await db.update({name: req.body.name}, {
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

    app.delete('/deletenullplayers', async (req, res) => {
      console.log('Deleting players with null teams')
      const db = client.db('marchmadness-main').collection('players2023');
      await db.remove({name: { $type : "string" }, team: null},
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


