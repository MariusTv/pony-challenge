class Maze {
    constructor(id, pony, endPoint, domokun, mazeData, width, height)
    {
        this.id = id;
        this.pony = pony;
        this.domokun = domokun;
        this.endPoint = endPoint;
        this.maze= mazeData;
        this.width = width;
        this.height = height;
        this.path = [this.pony];
        this.wrongPaths = [];
    }
    solve()
    {
        console.log(`Pony ${this.pony}`);
        while (this.pony !== this.endPoint && this.pony !== this.domokun) {
            const moves = this.getPossibleMoves();
            let minDistance = null;
            let nextMove = null;
            const lastPosition = this.path.length === 1 ? this.path[0] : this.path.slice(-2, -1).pop();

            moves.forEach((move) => {
                const distance = this.calculateDistance(move, this.endPoint);
                if ((distance < minDistance || !minDistance)
                    && move !== lastPosition
                    && this.wrongPaths.indexOf(move) === -1
                    && move !== this.domokun
                ) {
                    minDistance = distance;
                    nextMove = move;
                }
            });

            if(nextMove === null) {
                console.log('DEAD END :(');
                this.revert();
            } else {
                console.log(`${this.pony} -> ${nextMove}`);
                this.pony = nextMove;
                this.path.push(nextMove);
            }
        }

        console.log(`Pony ${this.pony}; End point ${this.endPoint}; Domokun ${this.domokun}`);
        const convertedPath = this.convertPathToDirections();
        console.log(convertedPath);
        return convertedPath;
    }

    revert()
    {
        //return 1 step back
        let wrongWay = this.path.pop();
        let previousPosition = this.path[this.path.length - 1];
        while (previousPosition !== null) {
            const moves = this.getPossibleMoves(previousPosition);
            const mergedMoves = [...moves, wrongWay, ...this.path.slice(-1)];
            const diff = mergedMoves.filter((e) => mergedMoves.indexOf(e) === mergedMoves.lastIndexOf(e));
            if (diff.length !== 0) {
                this.pony = previousPosition;
                this.wrongPaths.push(wrongWay);
                console.log(`Reverting pony to ${previousPosition}`);
                break;
            } else {
                wrongWay = previousPosition;
            }
            previousPosition = this.path.pop();
        }
    }


    getPossibleMoves(x = this.pony) {
        let moves = [];

        let walls = this.maze[x];
        if (walls.indexOf('west') === -1) {
            moves.push(x - 1);
        }
        if (walls.indexOf('north') === -1) {
            moves.push(x - (this.width));
        }

        if ((x - (this.width - 1)) % (this.width) !== 0) {
            walls = this.maze[x + 1];
            if (walls.indexOf('west') === -1) {
                moves.push(x + 1);
            }
        }


        if (x <= this.width * this.height - this.width - 1) {
            walls = this.maze[x + this.width];
            if (walls.indexOf('north') === -1) {
                moves.push(x + this.width);
            }
        }

        return moves;
    }

    calculateDistance(x, y) {
        return Math.abs((x % this.width) - (y % this.width)) + Math.abs(Math.floor(x / this.width) - Math.floor(y / this.width));
    }

    convertPathToDirections()
    {
        let directions = [];

        let previousLocation = this.path.shift();

        for (let i = 0; i < this.path.length; i++) {
            const currentLocation = this.path[i];

            switch(currentLocation - previousLocation){
                case 1:
                    directions.push('east');
                    break;
                case -1:
                    directions.push('west');
                    break;
                case this.width:
                    directions.push('south');
                    break;
                case -this.width:
                    directions.push('north');
                    break;
                default:
                break;
            }

            previousLocation = this.path[i];
        }

        return directions;
    }
}

module.exports = {Maze};
