
// const playerId = 'player1-xxx';
// const gameId = '5c663939-840d-4af8-b1b8-c705d92e6ef2';

// const CONNECT = "connect";
// const DISCONNECT = "disconnect";
// const CONNECT_FAILED = "connect_failed";
// const ERROR = "error";
// const JOIN_GAME = "join game";
// const TICKTACK_PLAYER = "ticktack player";
// const DRIVE_PLAYER = "drive player";
// const apiServer = 'https://codefest.techover.io';
// const socket = io.connect(apiServer, { reconnect: true, transports: ['websocket'] });

// // move
// const MOVE_LEFT = "1"
// const MOVE_RIGHT = "2"
// const MOVE_UP = "3"
// const MOVE_DOWN = "4"
// const DROP_BOMB = "b"

// // item

// const SPACE_STONE = 3;
// const MIND_STONE = 4;
// const REALITY_STONE = 5;
// const POWER_STONE = 6;
// const TIME_STONE = 7;
// const SOUL_STONE = 8;

// // declare variable
// let boms = [];
// let map = [];
// let myID;
// let player1 = {}
// let player2 = {}

// // data in game
// let data = {}
// let bombExplosed = true
// let playerStopMoving = true
// let countMoving = 0
// let countOfPath = 0
// let isPickSpoil = false

// let countSlient = 0


// // SOCKET EVENTS //

// // API-1b

// let init = () => {
//     connect2Server();
//     disconnect();
//     connectFailed();
//     error();
//     joinGame();
//     ticktackPlayer();
//     drivePlayerResponse();
// }

// let connect2Server = () => {
//     socket.on(CONNECT, () => {
//         document.getElementById('connected-status').innerHTML = 'on';
//         document.getElementById('socket-status').innerHTML = 'connected';
//         console.log('[socket] connected to server');
//         socket.emit(JOIN_GAME, {
//             game_id: gameId,
//             player_id: playerId
//         });
//     });
// }

// let disconnect = () => {
//     socket.on(DISCONNECT, () => {
//         console.warn('[socket] disconnected');
//         document.getElementById('socket-status').innerHTML = 'disconnected';
//     });
// }

// let connectFailed = () => {
//     socket.on(CONNECT_FAILED, () => {
//         console.warn('[socket] connect_failed');
//         document.getElementById('socket-status').innerHTML = 'connected failed';
//     });
// }

// let error = () => {
//     socket.on(ERROR, (err) => {
//         console.error('[socket] error ', err);
//         document.getElementById('socket-status').innerHTML = 'error!';
//     });
// }
// //api
// let joinGame = () => {
//     socket.on(JOIN_GAME, (res) => {
//         console.log('[socket] join-game responsed', res);
//         document.getElementById('joingame-status').innerHTML = 'on';
//     })
// }


// // api-3a
// let drivePlayer = (direction) => {
//     countOfPath = direction.length
//     socket.emit(DRIVE_PLAYER, {
//         direction: direction
//     })
// }


// //api-3b
// let drivePlayerResponse = () => {
//     socket.on(DRIVE_PLAYER, (res) => {
//         console.log('[socket] drive-player responsed, data: ', res);
//     });
// }

// let gap = 5;

// function getCurrentPosition() {
//     let currentX = -1
//     let currentY = -1
//     let players = data.map_info.players
//     for (let i = 0; i < players.length; ++i) {
//         if (players[i].id == playerId) {
//             currentX = players[i].currentPosition.row;
//             currentY = players[i].currentPosition.col;
//         }
//     }
//     return {
//         currentX: currentX,
//         currentY: currentY
//     }
// }

// function getMapMini(currentX, currentY) {
//     let row = data.map_info.size.rows;
//     let col = data.map_info.size.cols;

//     let mapMini = [0, 0, 0, 0];
//     if (currentX - gap < 0) {
//         mapMini[0] = 0;
//     } else {
//         mapMini[0] = currentX - gap;
//     }

//     if (currentY - gap < 0) {
//         mapMini[1] = 0;
//     } else {
//         mapMini[1] = currentY - gap;
//     }

//     if (currentX + gap > row) {
//         mapMini[2] = row;
//     } else {
//         mapMini[2] = currentX + gap;
//     }

//     if (currentY + gap > col) {
//         mapMini[3] = col;
//     } else {
//         mapMini[3] = currentY + gap;
//     }

//     return mapMini;
// }

// function checkPlayerIn4Corner() {
//     let row = data.map_info.size.rows;
//     let col = data.map_info.size.cols;
//     let currentPosition = getCurrentPosition();
//     let x = currentPosition.currentX;
//     let y = currentPosition.currentY;
//     console.log("playerStopMoving x" + x);
//     console.log("playerStopMoving y" + y);
//     return (x == 1 && y == 1) || (x == row - 2 && y == col - 2) ||
//         (x == 1 && y == col - 2) || (x == row - 2 && y == 1)
// }



// //api-2
// let ticktackPlayer = () => {
//     socket.on(TICKTACK_PLAYER, (res) => {
//         document.getElementById('ticktack-status').innerHTML = 'on';
//         console.log('[socket] ticktack-player responsed, data : ', res);

//         if (res.tag == "start-game") {
//             data = res;
//             getItem();
//             bombExplosed = false;
//             playerStopMoving = false;
//         }

//         if (res.player_id == playerId) {
//             data = res

//             if (res.tag == 'player:pick-spoil') {
//                 isPickSpoil = true;
//             }

//             if (res.tag == 'bomb:explosed') {
//                 bombExplosed = true;
//             }

//             if (res.tag == 'player:stop-moving') {
//                 ++countMoving
//                 if (countMoving == countOfPath - 1) {
//                     playerStopMoving = true;
//                 }

//                 if(isPickSpoil){
//                     playerStopMoving = true;
//                     bombExplosed = true;
//                 }
//             }

//             if (bombExplosed && playerStopMoving) {
//                 bombExplosed = false;
//                 playerStopMoving = false;
//                 countMoving = 0;
//                 isPickSpoil = false;
//                 countSlient = 0;
//                 getItem();
//             }
//         }else{
//             if (res.tag == 'player:stop-moving') {
//                 ++countSlient;
//             }
//             if(countSlient>=15){
//                 bombExplosed = false;
//                 playerStopMoving = false;
//                 countMoving = 0;
//                 isPickSpoil = false;
//                 getItem(); 
//             }
//         }
//         // "player:pick-spoil"

//     })
// }


// const MAX_PATH = 8;
// const BOX_VALUE = 2;
// const EMPTY_VALUE = 0;
// function getItem() {
//     console.log("----------------TRY GET ITEM-------------------")
//     let items = data.map_info.spoils;
//     let found = false;
//     let tryGetItem = [];
//     if (items.length > 0) {
//         let map2D = getMapIn2D();
//         let currentPosition = getCurrentPosition()
//         for (let i = 0; i < items.length; ++i) {
//             if (items[i].spoil_type !== MIND_STONE) {
//                 tryGetItem.push({
//                     path: getPath(map2D, currentPosition.currentX, currentPosition.currentY, items[i].row, items[i].col, false),
//                     x: items[i].row,
//                     y: items[i].col
//                 })
//             }
//         }
//         tryGetItem.sort(compare);
//         console.log(tryGetItem);
//         for (let i = 0; i < tryGetItem.length; ++i) {
//             if (tryGetItem[i].path.length > 0 && canGotoLife(tryGetItem[i].path)) {
//                 let direction = getDirectionToItem(tryGetItem[i].path, currentPosition);
//                 drivePlayer(direction);
//                 found = true;
//                 break;
//             }
//         }
//     }
//     if (!found) {
//         getBoxNearest();
//     }
// }

// function getDirectionToItem(move, currentPosition) {
//     let direction = ""
//     let x = currentPosition.currentX;
//     let y = currentPosition.currentY;
//     for (let i = 0; i < move.length; ++i) {
//         if (move[i].x > x) {
//             direction += MOVE_DOWN;
//         }

//         if (move[i].x < x) {
//             direction += MOVE_UP;
//         }

//         if (move[i].y > y) {
//             direction += MOVE_RIGHT;
//         }

//         if (move[i].y < y) {
//             direction += MOVE_LEFT;
//         }

//         x = move[i].x;
//         y = move[i].y;
//     }

//     return direction;
// }

// function canGotoLife(path) {
//     let isLife = true;
//     let bombs = data.map_info.bombs;
//     let bombLength = bombs.length;
//     let pathLength = path.length;
//     let endOfPath = path[pathLength - 1];
//     for (let i = 0; i < bombLength; ++i) {
//         if (bombs[i].row == endOfPath.x || bombs[i].col == endOfPath.y) {
//             console.log("asdasd die");
//             isLife = false;
//             break;
//         }
//     }

//     if (isLife) {
//         for (let i = 0; i < bombLength; ++i) {
//             let countX = 0;
//             let countY = 0;
//             for (let j = 0; j < pathLength; j++) {
//                 let gap = getGap(path[j].x, path[j].y, bombs[i].row, bombs[i].col);
//                 if (gap < MAX_PATH) {
//                     if (path[j].x == bombs[i].row) {
//                         ++countX;
//                     }
//                     if (path[j].y == bombs[i].col) {
//                         ++countY;
//                     }
//                 }
//             }
//             if (countX > 3 || countY > 3) {
//                 console.log("asdasd die");
//                 isLife = false;
//                 break;
//             }
//         }
//     }

//     return isLife
// }

// function getBoxNearest() {
//     console.log("----------------TRY MOVE-------------------")
//     let tryMove = []
//     let currentPosition = getCurrentPosition()
//     let mapMini = getMapMini(currentPosition.currentX, currentPosition.currentY);
//     let map = data.map_info.map
//     let found = false;
//     let map2D = getMapIn2D()
//     for (let i = mapMini[0]; i < mapMini[2]; ++i) {
//         for (let j = mapMini[1]; j < mapMini[3]; ++j) {
//             if (map[i][j] == BOX_VALUE) {
//                 let path = getPath(map2D, currentPosition.currentX, currentPosition.currentY, i, j, true);
//                 if (path.length > 0) {
//                     tryMove.push({
//                         path: path,
//                         x: i,
//                         y: j
//                     })
//                 }
//             }
//         }
//     }
//     tryMove.sort(compare);
//     console.log("-----------MOVE-----------");
//     console.log("current position " + currentPosition.currentX)
//     console.log("current position " + currentPosition.currentY)
//     console.log(tryMove);
//     for (let k = 0; k < tryMove.length; ++k) {
//         if (tryMove[k].path.length > 0 && canGotoLife(tryMove[k].path)) {
//             found = getBackPath(tryMove[k], map2D);
//             if (found) {
//                 break;
//             }
//         }
//     }

//     if(!found){
//         gap+=5;
//         if(gap>=30){
//             modePK();
//             gap=5; 
//         }else{
//             getBoxNearest()
//         }
//         console.log("-----------CAN NOT MOVE-----------");
//     }else{
//         gap=5; 
//     }
// }

// function modePK(){
//     console.log("-----------PK MODE-----------");  
//     // getBoxNearest();
// }
// function getPath(map2D, x1, y1, x2, y2, isBox) {

//     if (isBox) {
//         map2D[x2][y2] = 1;
//     }

//     let graph = new Graph(map2D);

//     if (isBox) {
//         map2D[x2][y2] = 0;
//     }

//     let path = astar.search(
//         graph, graph.grid[x1][y1], graph.grid[x2][y2]
//     );
//     return path;
// }

// function getBackPath(tryMove, map2D) {
//     let tryMoveBack = []
//     let currentPosition = getCurrentPosition();
//     let found = false;
//     let path = tryMove.path
//     let map = data.map_info.map;
//     if (path.length >= 1) {
//         if (path.length > 1) {
//             currentPosition.currentX = path[path.length - 2].x;
//             currentPosition.currentY = path[path.length - 2].y;
//         }
//         if (!found) {
//             mapMini = getMapMini(currentPosition.currentX, currentPosition.currentY);
//             for (let i = mapMini[0]; i < mapMini[2]; ++i) {
//                 for (let j = mapMini[1]; j < mapMini[3]; ++j) {
//                     if (map[i][j] == 0 && i != currentPosition.currentX && j != currentPosition.currentY) {
//                         let pathBack = getPath(map2D, currentPosition.currentX, currentPosition.currentY, i, j, false);
//                         if (pathBack.length) {
//                             tryMoveBack.push({
//                                 path: pathBack,
//                                 x: i,
//                                 y: j
//                             })
//                         }
//                     }
//                 }
//             }
//             tryMoveBack.sort(compare);
//             console.log("-------------TRY MOVE BACK -------------------")
//             console.log(tryMoveBack);
//             for (let r = 0; r < tryMoveBack.length; r++) {
//                 let direction = ""
//                 if (tryMoveBack[r].path.length > 0 && canGotoLife(tryMoveBack[r].path)) {
//                     direction = getDirection(path, tryMoveBack[r].path, getCurrentPosition());
//                     if (direction.length > 0) {
//                         drivePlayer(direction);
//                         found = true;
//                         break;
//                     }
//                 }
//             }
//         }
//     }

//     return found

// }

// function getDirection(move, moveBack, currentPosition) {
//     console.log("-----------GET DIRECTION----------");
//     console.log("START");
//     console.log(move);
//     console.log("STOP");
//     console.log(moveBack);
//     let direction = ""
//     let x = currentPosition.currentX;
//     let y = currentPosition.currentY;
//     for (let i = 0; i < move.length - 1; ++i) {
//         if (move[i].x > x) {
//             direction += MOVE_DOWN
//         }

//         if (move[i].x < x) {
//             direction += MOVE_UP
//         }

//         if (move[i].y > y) {
//             direction += MOVE_RIGHT
//         }

//         if (move[i].y < y) {
//             direction += MOVE_LEFT
//         }

//         x = move[i].x;
//         y = move[i].y;
//     }

//     direction += DROP_BOMB

//     for (let i = 0; i < moveBack.length; ++i) {
//         if (moveBack[i].x > x) {
//             direction += MOVE_DOWN
//         }

//         if (moveBack[i].x < x) {
//             direction += MOVE_UP
//         }

//         if (moveBack[i].y > y) {
//             direction += MOVE_RIGHT
//         }

//         if (moveBack[i].y < y) {
//             direction += MOVE_LEFT
//         }

//         x = moveBack[i].x;
//         y = moveBack[i].y;
//     }

//     return direction;


// }

// function getGap(x1, y1, x2, y2) {
//     return Math.abs(x1 - x2) + Math.abs(y1 - y2);
// }

// function getMapIn2D() {
//     let row = data.map_info.size.rows;
//     let col = data.map_info.size.cols;
//     let newMap = new Array(row);
//     let map = data.map_info.map;
//     for (let i = 0; i < row; ++i) {
//         let arrayRow = new Array(col);
//         for (let j = 0; j < col; ++j) {
//             if (map[i][j] == 0) {
//                 arrayRow[j] = 1;
//             } else {
//                 arrayRow[j] = 0;
//             }
//         }
//         newMap[i] = arrayRow;
//     }
//     return newMap;
// }

// function compare(a, b) {
//     return a.path.length - b.path.length;
// }

// init();
