const axios = require('axios');
const express = require('express');
const Pusher = require('pusher');
const path = require('path');
const {Maze} = require('./services/Maze');

const PORT = process.env.PORT || 5000;
const app = express();

const pusher = new Pusher({
    appId: '674155',
    key: '3c69a0dded15876990e0',
    secret: '07ac571cc97602ea2505',
    cluster: 'eu',
    useTLS: true
});

let mazeId = null;
let maze = null;

app.use(express.static(path.resolve(__dirname, '../frontend/build')));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

/** API requests. **/

/** Create maze and return printed version **/
app.get('/api/create-maze', async function (req, res) {
        let mazePrint = [];

        /** Create maze **/
        await axios.post('https://ponychallenge.trustpilot.com/pony-challenge/maze', {
                "maze-width": 15,
                "maze-height": 15,
                "maze-player-name": "Rarity",
                "difficulty": 0
        }).then((response) => {
                const resp = (response.data);
                mazeId = resp.maze_id;
        }).catch((error) => {
            // handle error
            res.status(500).send(error);
        });

        /** Get maze params **/
        await axios.get(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${mazeId}`)
            .then((response) => {
                let {pony, "end-point": endPoint, domokun, "data":mazeData, size} = response.data;
                maze = new Maze(mazeId, pony[0], endPoint[0], domokun[0], mazeData, size[0], size[1]);
            })
            .catch((error) => {
                res.status(500).send(error);
            });

        /** Get maze print **/
        await axios.get(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${mazeId}/print`)
            .then((response) => {
                mazePrint = response.data;
            }).catch((error) => {
                res.status(500).send(error);
            });

        res.json(mazePrint);
});

/** Solve maze **/
app.get('/api/solve-maze', async function (req, res) {
    const path = maze.solve();
    res.sendStatus(200);

    let mazePrint = null;
    let result = null;
    let status = null;

    for(const direction of path){
        /** Send direction **/
        await axios.post(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${maze.id}`, {
            direction
        }).then((response) => {
            let {state, "state-result": stateResult} = response.data;
            result = stateResult;
            status = state;

            pusher.trigger('maze', 'statusChange', {
                "state": status,
                "result": result
            });
        }).catch((error) => {
            //handle errors
            console.log(error);
        });

        /** Get maze print **/
        await axios.get(`https://ponychallenge.trustpilot.com/pony-challenge/maze/${maze.id}/print`)
            .then((response) => {
                mazePrint = response.data;

                pusher.trigger('maze', 'mazeChange', {
                    "maze": mazePrint
                });
            }).catch((error) => {});
    }

    pusher.trigger('maze', 'statusChange', {
        "state": '',
        "result": 'Game ended'
    });

});

// All remaining requests return the React app
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

app.listen(PORT, function () {
    console.error(`Listening on port ${PORT}`);
});

