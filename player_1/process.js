const playerId_full = "9135a99c-a35e-48ee-ae47-12cf81ea3096";
const playerId = "9135a99c-a35e";
const gameId = '526b1e37-4dfd-4dc0-914d-ba2c8012d7e9';

const CONNECT = "connect";
const DISCONNECT = "disconnect";
const CONNECT_FAILED = "connect_failed";
const ERROR = "error";
const JOIN_GAME = "join game";
const TICKTACK_PLAYER = "ticktack player";
const DRIVE_PLAYER = "drive player";
const apiServer = 'http://10.17.74.92';
const socket = io.connect(apiServer, { reconnect: true, transports: ['websocket'] });

// item
const EMPTY_VALUE = 0;
const BOX_VALUE = 2;
const SPACE_STONE = 3;
const MIND_STONE = 4;
const REALITY_STONE = 5;
const POWER_STONE = 6;
const TIME_STONE = 7;
const SOUL_STONE = 8;


// game status
const START_GAME = 'start-game';
const PLAYER_PICK_SPOIL = 'player:pick-spoil';
const BOMB_EXPLOSED = 'bomb:explosed';
const PLAYER_STOP_MOVING = 'player:stop-moving';
const PLAYER_START_MOVING = 'player:start-moving';
const PLAYER_MOVING_BANNED = 'player:moving-banned';
const BOMB_SETUP = 'bomb:setup';
let GAP = 5;

let destination = {};
let isContinue = false;

// move
const MOVE_LEFT = "1";
const MOVE_RIGHT = "2";
const MOVE_UP = "3";
const MOVE_DOWN = "4";
const DROP_BOMB = "b";

// SOCKET EVENTS //

// API-1b
let init = () => {
    connect2Server();
    disconnect();
    connectFailed();
    error();
    joinGame();
    ticktackPlayer();
    drivePlayerResponse();
};

let connect2Server = () => {
    socket.on(CONNECT, () => {
        document.getElementById('connected-status').innerHTML = 'on';
        document.getElementById('socket-status').innerHTML = 'connected';
        console.log('[socket] connected to server');
        socket.emit(JOIN_GAME, {
            game_id: gameId,
            player_id: playerId_full
        });
    });
};

let disconnect = () => {
    socket.on(DISCONNECT, () => {
        console.warn('[socket] disconnected');
        document.getElementById('socket-status').innerHTML = 'disconnected';
    });
};

let connectFailed = () => {
    socket.on(CONNECT_FAILED, () => {
        console.warn('[socket] connect_failed');
        document.getElementById('socket-status').innerHTML = 'connected failed';
    });
};

let error = () => {
    socket.on(ERROR, (err) => {
        console.error('[socket] error ', err);
        document.getElementById('socket-status').innerHTML = 'error!';
    });
};
//api
let joinGame = () => {
    socket.on(JOIN_GAME, (res) => {
        console.log('[socket] join-game responsed', res);
        document.getElementById('joingame-status').innerHTML = 'on';
    })
};


// api-3a
let drivePlayer = (direction) => {
    // countOfPath = direction.length
    socket.emit(DRIVE_PLAYER, {
        direction: direction
    })
};


//api-3b
let drivePlayerResponse = () => {
    socket.on(DRIVE_PLAYER, (res) => {
        console.log('[socket] drive-player responsed, data: ', res);
    });
};

let isPick = false;
let isBom = false;
let count = 0;
let isBomExplosed = false;
let lastMoving = false;

//api-2
let ticktackPlayer = () => {
    socket.on(TICKTACK_PLAYER, (res) => {
        document.getElementById('ticktack-status').innerHTML = 'on';
        console.log('data : ', res);
        data = res;

        if (res.tag === START_GAME) {
            run();
            return;
        }

        if (res.tag === PLAYER_MOVING_BANNED) {
            run();
            return;
        }

        if (count >= 10) {
            getItem();
            count = 0;
            isPick = false;
            isBom = false;
        }

        if (res.player_id.localeCompare(playerId) === 0) {
            let canRun = false;
            if (res.tag === PLAYER_PICK_SPOIL) {
                isPick = true;
            }

            if (res.tag === BOMB_SETUP) {
                isBom = true;
                console.log("Bomb setup");
            }

            if (res.tag === PLAYER_START_MOVING) {
                lastMoving = true;
            }

            if (res.tag === BOMB_EXPLOSED) {
                isBomExplosed = true;
            } else if (res.tag === PLAYER_STOP_MOVING) {
                lastMoving = false;
                canRun = isPick;
                let currentPosition = getCurrentPosition();
                console.log("currentPosition.x " + currentPosition.x);
                console.log("currentPosition.y " + currentPosition.y);
                console.log("destination.x " + destination.x);
                console.log("destination.y " + destination.y);
                if (currentPosition.x === destination.x && currentPosition.y === destination.y && isBom) {
                    isPick = false;
                    isBom = false;
                    console.log("Move continute");
                    run();
                    return;
                }
            }
            if (!lastMoving && isBomExplosed) {
                canRun = true;
            }

            if (canRun) {
                console.log("Bomb setup: Run");
                count = 0;
                isPick = false;
                isBom = false;
                isBomExplosed = false;
                getItem();
            }
        } else {
            count += 1;
            let a = getCurrentPosition();
            let b = getPositionEnemy();

            if (res.tag === BOMB_EXPLOSED) {
                checkPlayerSafe();
            }

            let checkGap = getGap(a.x, a.y, b.x, b.y);
            if (checkGap < 5) {
                drivePlayer("x");
                run();

            }
        }
    })
};


function checkPlayerSafe(){

}

function run() {
    console.log("----------------TRY MOVE-------------------");
    let mapBinary = genMapBinary();
    let found = false;
    let arr = [];
    let currentPosition = getCurrentPosition();
    let positionEnemy = getPositionEnemy();
    let mapMini = getMapMini(currentPosition.x, currentPosition.y);
    let map = data.map_info.map;
    for (let i = mapMini[0]; i < mapMini[2]; ++i) {
        for (let j = mapMini[1]; j < mapMini[3]; ++j) {

            if (map[i][j] === BOX_VALUE || (i === positionEnemy.x && j === positionEnemy.y)) {
                let path = getPath(mapBinary, currentPosition.x, currentPosition.y, i, j, true);
                if (path.length > 0) {
                    if (path.length > 0) {
                        path.splice(path.length - 1, 1);
                    }
                    arr.push({
                        path: path,
                        x: i,
                        y: j
                    })
                }
            }
        }
    }
    arr.sort(compare);
    console.log("Move");
    console.log(arr);
    for (let i = 0; i < arr.length; ++i) {
        found = runBack(arr[i].path, mapBinary);
        if (found) {
            break;
        }
    }
    if (!found) {
        GAP += 3;
        if (GAP < 15) {
            console.log("Next run");
            run();
        } else {
            isContinue = false;
            console.log("Can run");
        }
    } else {
        console.log("Run success");
        GAP = 3;
    }
}

function runBack(path, mapBinary) {
    let tempGap = GAP;
    GAP = 3;
    let currentPosition = getCurrentPosition();
    let x = currentPosition.x;
    let y = currentPosition.y;
    let found = false;
    let arr = [];
    if (path.length >= 1) {
        x = path[path.length - 1].x;
        y = path[path.length - 1].y;
    }
    let power = getBombPower();
    let mapMini = getMapMini(x, y);
    for (let i = mapMini[0]; i < mapMini[2]; ++i) {
        for (let j = mapMini[1]; j < mapMini[3]; ++j) {
            if (mapBinary[i][j] === 1) {
                let pathBack = getPath(mapBinary, x, y, i, j, false);
                // if (pathBack.length > power) {
                //     arr.push({
                //         path: pathBack,
                //         x: i,
                //         y: j
                //     })
                // }
                if (pathBack.length > 0) {
                    let pathLength = pathBack.length;
                    // console.log("pathBack[pathLength - 1].x " + pathBack[pathLength - 1].x);
                    // console.log("pathBack[pathLength - 1].y " + pathBack[pathLength - 1].y);
                    // console.log("x " + x);
                    // console.log("y " + y);
                    if (pathBack[pathLength - 1].x === x || pathBack[pathLength - 1].y === y) {
                        if (pathBack.length > power) {
                            arr.push({
                                path: pathBack,
                                x: i,
                                y: j
                            })
                        }
                    } else {
                        arr.push({
                            path: pathBack,
                            x: i,
                            y: j
                        })
                    }
                }
            }
        }
    }

    arr.sort(compare);
    console.log("Move back");
    console.log(arr);
    for (let i = 0; i < arr.length; ++i) {
        let direction = getDirection(path, arr[i].path, currentPosition);
        if (direction.length > 0) {
            destination = {
                x: arr[i].x,
                y: arr[i].y
            };
            console.log("direction " + direction);
            drivePlayer(direction);
            found = true;
            break;
        }
    }
    GAP = tempGap;
    return found;
}

function getDirection(move, moveBack, currentPosition) {
    let direction = "";
    let x = currentPosition.x;
    let y = currentPosition.y;
    for (let i = 0; i < move.length; ++i) {
        if (move[i].x > x) {
            direction += MOVE_DOWN
        }

        if (move[i].x < x) {
            direction += MOVE_UP
        }

        if (move[i].y > y) {
            direction += MOVE_RIGHT
        }

        if (move[i].y < y) {
            direction += MOVE_LEFT
        }

        x = move[i].x;
        y = move[i].y;
    }

    direction += DROP_BOMB;

    for (let i = 0; i < moveBack.length; ++i) {
        if (moveBack[i].x > x) {
            direction += MOVE_DOWN
        }

        if (moveBack[i].x < x) {
            direction += MOVE_UP
        }

        if (moveBack[i].y > y) {
            direction += MOVE_RIGHT
        }

        if (moveBack[i].y < y) {
            direction += MOVE_LEFT
        }

        x = moveBack[i].x;
        y = moveBack[i].y;
    }
    return direction;
}

function canGetItem() {
    let items = data.map_info.spoils;
    return items.length > 0;
}

function getItem() {
    console.log("----------------TRY GET ITEM-------------------");
    let items = data.map_info.spoils;
    let mapBinary = genMapBinary();
    let found = false;
    let arr = [];
    let currentPosition = getCurrentPosition();
    for (let i = 0; i < items.length; ++i) {
        if (items[i].spoil_type !== MIND_STONE)
            arr.push({
                path: getPath(mapBinary, currentPosition.x, currentPosition.y, items[i].row, items[i].col, false),
                x: items[i].row,
                y: items[i].col
            })
    }

    arr.sort(compare);
    console.log(arr);
    for (let i = 0; i < arr.length; ++i) {
        if (arr[i].path.length > 0) {
            let direction = getDirectionToItem(arr[i].path, currentPosition);
            destination = {
                x: arr[i].x,
                y: arr[i].y
            };
            drivePlayer(direction);
            found = true;
            break;
        }
    }

    if (!found) {
        run();
    }
}


function getPath(mapBinary, x1, y1, x2, y2, isBox) {

    if (isBox) {
        mapBinary[x2][y2] = 1;
    }

    let graph = new Graph(mapBinary);

    let path = astar.search(
        graph, graph.grid[x1][y1], graph.grid[x2][y2]
    );
    if (isBox) {
        mapBinary[x2][y2] = 0;
    }
    // console.log("data first ["+x2+","+y2+"] "+mapBinary[x2][y2]);
    // console.log("Move from ["+x1+","+y1+"] to ["+x2+","+y2+"]");

    return path;
}

function getDistance(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function genMapBinary() {
    let row = data.map_info.size.rows;
    let col = data.map_info.size.cols;
    let newmap = new Array(row);
    let map = data.map_info.map;
    for (let i = 0; i < row; ++i) {
        let arrayRow = new Array(col);
        for (let j = 0; j < col; ++j) {
            if (map[i][j] === 0) {
                arrayRow[j] = 1;
            } else {
                arrayRow[j] = 0;
            }
        }
        newmap[i] = arrayRow;
    }
    let player1 = data.map_info.players[0];
    let player2 = data.map_info.players[1];
    if (player1.id.localeCompare(playerId) === 0) {
        newmap[player1.currentPosition.row][player1.currentPosition.col] = 1;
        newmap[player2.currentPosition.row][player2.currentPosition.col] = 0;
    } else {
        newmap[player2.currentPosition.row][player2.currentPosition.col] = 1;
        newmap[player1.currentPosition.row][player1.currentPosition.col] = 0;
    }

    let bombs = data.map_info.bombs;
    for (let i = 0; i < bombs.length; ++i) {
        let power = 1;
        let x = bombs[i].row;
        let y = bombs[i].col;
        if (bombs[i].playerId === player1.id) {
            power = player1.powerStone + 1;
        } else {
            power = player2.powerStone + 1;
        }

        for (let j = Math.max(0, x - power); j < Math.min(row, x + power + 1); j++) {
            newmap[j][y] = 0;
        }
        for (let j = Math.max(0, y - power); j < Math.min(col, y + power + 1); j++) {
            newmap[x][j] = 0;
        }
    }

    return newmap;
}

function getBombPower() {
    let player1 = data.map_info.players[0];
    let player2 = data.map_info.players[1];
    if (player1.id.localeCompare(playerId) === 0) {
        return player1.powerStone + 1;
    } else {
        return player2.powerStone + 1;
    }
}

function getMapMini(x, y) {
    let row = data.map_info.size.rows;
    let col = data.map_info.size.cols;

    let mapMini = [0, 0, 0, 0];
    if (x - GAP < 0) {
        mapMini[0] = 0;
    } else {
        mapMini[0] = x - GAP;
    }

    if (y - GAP < 0) {
        mapMini[1] = 0;
    } else {
        mapMini[1] = y - GAP;
    }

    if (x + GAP > row) {
        mapMini[2] = row;
    } else {
        mapMini[2] = x + GAP;
    }

    if (y + GAP > col) {
        mapMini[3] = col;
    } else {
        mapMini[3] = y + GAP;
    }

    return mapMini;
}

function getCurrentPosition() {
    let x = -1;
    let y = -1;
    let players = data.map_info.players;
    for (let i = 0; i < players.length; ++i) {
        if (players[i].id.localeCompare(playerId) === 0) {
            x = players[i].currentPosition.row;
            y = players[i].currentPosition.col;
        }
    }
    return {
        x: x,
        y: y
    }
}


function getPositionEnemy() {
    let x = -1;
    let y = -1;
    let players = data.map_info.players;
    for (let i = 0; i < players.length; ++i) {
        if (players[i].id.localeCompare(playerId) !== 0) {
            x = players[i].currentPosition.row;
            y = players[i].currentPosition.col;
            break;
        }
    }
    return {
        x: x,
        y: y
    }
}

function compare(a, b) {

    if (a.path.length === 0) {
        return -1
    }
    if (b.path.length === 0) {
        return 1;
    }
    if (a.path.length === b.path.length) {
        let position_a = a.path[a.path.length - 1];
        let position_b = b.path[b.path.length - 1];
        let row = data.map_info.size.rows;
        let col = data.map_info.size.cols;
        let gap_a = getGap(position_a.x, position_a.y, parseInt(row / 2), parseInt(col / 2));
        let gap_b = getGap(position_b.x, position_b.y, parseInt(row / 2), parseInt(col / 2));
        return gap_b - gap_a;
    } else {
        return a.path.length - b.path.length;
    }
}

function getGap(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function getDirectionToItem(move, currentPosition) {
    let direction = "";
    let x = currentPosition.x;
    let y = currentPosition.y;
    for (let i = 0; i < move.length; ++i) {
        if (move[i].x > x) {
            direction += MOVE_DOWN;
        }

        if (move[i].x < x) {
            direction += MOVE_UP;
        }

        if (move[i].y > y) {
            direction += MOVE_RIGHT;
        }

        if (move[i].y < y) {
            direction += MOVE_LEFT;
        }

        x = move[i].x;
        y = move[i].y;
    }

    return direction;
}

init();

function compareTest(a, b) {
    let row = 8;
    let col = 8;
    let gap_a = getGap(a.x, a.y, parseInt(row / 2), parseInt(col / 2));
    let gap_b = getGap(b.x, b.y, parseInt(row / 2), parseInt(col / 2));
    return gap_b - gap_a;
}