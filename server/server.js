const axios = require('axios');
const express = require('express');
var Pusher = require('pusher');

const path = require('path');
const bodyParser = require('body-parser');
const {Maze} = require('./services/Maze');

const PORT = process.env.PORT || 5000;
const app = express();

var pusher = new Pusher({
    appId: '674155',
    key: '3c69a0dded15876990e0',
    secret: '07ac571cc97602ea2505',
    cluster: 'eu',
    encrypted: true
});


let mazeId = null;
let maze = null;

app.use(express.static(path.resolve(__dirname, '../frontend/build')));
// app.use(bodyParser.json()); // for parsing application/json

//change
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Answer API requests.
app.get('/api/create-maze', async function (req, res) {
        let mazePrint = [];
        await axios.post('https://ponychallenge.trustpilot.com/pony-challenge/maze', {
                "maze-width": 15,
                "maze-height": 15,
                "maze-player-name": "Rarity",
                "difficulty": 0
        }).then((response) => {
                const resp = (response.data);
                mazeId = resp.maze_id;

                console.log(mazeId);
        }).catch((error) => {
            // handle error
            res.status(500).send(error);
        });

        await axios.get(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${mazeId}`)
            .then((response) => {
                let {pony, "end-point": endPoint, domokun, "data":mazeData, size} = response.data;
                maze = new Maze(mazeId, pony.pop(), endPoint.pop(), domokun.pop(), mazeData, size[0], size[1]);
            })
            .catch((error) => {
                res.status(500).send(error);
            });

        await axios.get(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${mazeId}/print`)
            .then((response) => {
                mazePrint = response.data;
            }).catch((error) => {
                res.status(500).send(error);
            });

        res.json(mazePrint);

});

app.get('/api/solve-maze', async function (req, res) {
    const path = maze.solve();
    res.sendStatus(200);

    let mazePrint = null;
    let status = null;

    for(const direction of path){
        await axios.post(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${maze.id}`, {
            direction
        }).then((response) => {
            let {state, "state-result": stateResult} = response.data;
            status = stateResult;
        }).catch((error) => {
            console.log(error);
        });

        await axios.get(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${maze.id}/print`)
            .then((response) => {
                mazePrint = response.data;
            }).catch((error) => {});

        pusher.trigger('maze', 'mazeChange', {
            "maze": mazePrint
        });
        pusher.trigger('maze', 'statusChange', {
            "status": status
        });
    }

});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Listening on port ${PORT}`);
});

