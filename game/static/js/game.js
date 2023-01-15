// var roomCode = document.getElementById("game_board").getAttribute("room_code");
// var char_choice = document.getElementById("game_board").getAttribute("char_choice");

// // connecting to socket
// var connectionString = 'ws://' + window.location.host + '/ws/play/' + roomCode + '/';

// var gameSocket = new WebSocket(connectionString);

// // Game board for maintaing the state of the game

// var gameBoard = [
//     -1, -1, -1,
//     -1, -1, -1,
//     -1, -1, -1,
// ];

// // Winning indexes.

// winIndices = [
//     [0, 1, 2],
//     [3, 4, 5],
//     [6, 7, 8],
//     [0, 3, 6],
//     [1, 4, 7],
//     [2, 5, 8],
//     [0, 4, 8],
//     [2, 4, 6]
// ]

// let moveCount = 0; //Number of moves done
// let myturn = true; // Boolean variable to get the turn of the player.

// // Add the click event listener on every block.
// let elementArray = document.getElementsByClassName('square');
// for (var i = 0; i < elementArray.length; i++){

//         elementArray[i].addEventListener("click", event=>{

//             const index = event.path[0].getAttribute('data-index');
//             if(gameBoard[index] == -1){
//                 if(!myturn){
//                     alert("Wait for other to place the move")
//                 }
//                 else{
//                     myturn = false;
//                     document.getElementById("alert_move").style.display = 'none'; // Hide
//                     make_move(index, char_choice);
//                 }
//             }
//         })
//     }

// // Make a move

// function make_move(index, player){

//         index = parseInt(index);
//         let data = {
//             "event": "MOVE",
//             "message": {
//                 "index": index,
//                 "player": player
//             }
//         }

//         if(gameBoard[index] == -1){
//             // if the valid move, update the gameboard
//             // state and send the move to the server.
//             moveCount++;
//             if(player == 'X')
//                 gameBoard[index] = 1;
//             else if(player == 'O')
//                 gameBoard[index] = 0;
//             else{
//                 alert("Invalid character choice");
//                 return false;
//             }
//             gameSocket.send(JSON.stringify(data))
//     }
// // place the move in the game box.
//         elementArray[index].innerHTML = player;
//         // check for the winner
//         const win = checkWinner();
//         if(myturn){
//             // if player winner, send the END event.
//             if(win){
//                 data = {
//             "event": "END",
//             "message": `${player} is a winner. Play again?`
//         }
//         gameSocket.send(JSON.stringify(data))
//     }
//     else if(!win && moveCount == 9){
//         data = {
//             "event": "END",
//             "message": "It's a draw. Play again?"
//         }
//         gameSocket.send(JSON.stringify(data))
//     }
// }
// }

// // function to reset the game.
// function reset(){
// gameBoard = [
//     -1, -1, -1,
//     -1, -1, -1,
//     -1, -1, -1,
// ];
// moveCount = 0;
// myturn = true;
// document.getElementById("alert_move").style.display = 'inline';
// for (var i = 0; i < elementArray.length; i++){
//     elementArray[i].innerHTML = "";
// }
// }

// // check if their is winning move
// const check = (winIndex) => {
// if (
//   gameBoard[winIndex[0]] !== -1 &&
//   gameBoard[winIndex[0]] === gameBoard[winIndex[1]] &&
//   gameBoard[winIndex[0]] === gameBoard[winIndex[2]]
// )   return true;
// return false;
// };

// // function to check if player is winner.
// function checkWinner(){
// let win = false;
// if (moveCount >= 5) {
//   winIndices.forEach((w) => {
//     if (check(w)) {
//       win = true;
//       windex = w;
//     }
//   });
// }
// return win;
// }

// // Main function which handles the connection
// // of websocket.
// function connect() {
// gameSocket.onopen = function open() {
//     console.log('WebSockets connection created.');
//     // on websocket open, send the START event.
//     gameSocket.send(JSON.stringify({
//         "event": "START",
//         "message": ""
//     }));
// };

// gameSocket.onclose = function (e) {
//     console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
//     setTimeout(function () {
//         connect();
//     }, 1000);
// };
// // Sending the info about the room
// gameSocket.onmessage = function (e) {
//     // On getting the message from the server
//     // Do the appropriate steps on each event.
//     let data = JSON.parse(e.data);
//     data = data["payload"];
//     let message = data['message'];
//     let event = data["event"];
//     switch (event) {
//         case "START":
//             reset();
//             break;
//         case "END":
//             alert(message);
//             reset();
//             break;
//         case "MOVE":
//             if(message["player"] != char_choice){
//                 make_move(message["index"], message["player"])
//                 myturn = true;
//                 document.getElementById("alert_move").style.display = 'inline';
//             }
//             break;
//         default:
//             console.log("No event")
//     }
// };

// if (gameSocket.readyState == WebSocket.OPEN) {
//     gameSocket.onopen();
// }
// }
// connect();

// var room_code = "{{room_code}}";
// var char_choice = "{{char_choice}}";
var room_code = document.getElementById("game_board").getAttribute("room_code");
var char_choice = document
  .getElementById("game_board")
  .getAttribute("char_choice");
var myTurn = "";

let socket = new WebSocket(
  "ws://localhost:8000/ws/play" + "/" + room_code + "/"
);

// state of the board

var gameState = ["", "", "", "", "", "", "", "", ""];

// // Add the click event listener on every block.

let elementArray = document.querySelectorAll(".square");
elementArray.forEach(function (element) {
  element.addEventListener("click", function (event) {
    setCursor(event.path[0].getAttribute("data-index"), char_choice);
  });
});
const endGame = (value, player) => {
  var count = 0;
  gameState.map((game) => {
    if (game != "") {
      count++;
    }
  });

  if (count >= 9) {
    var data = {
      event: "OVER",
      message: {
        index: value,
        player: player,
      },
      signal: "game over ! No one Wins this time",
      player: player,
    };
    socket.send(JSON.stringify(data));
    swal("game over!", " No one Wins this time", "warning");
    reset();
  }
};

function reset() {
  console.log("reset it");
  gameState = ["", "", "", "", "", "", "", "", ""];

  elementArray[0].innerHTML = "";
  elementArray[1].innerHTML = "";
  elementArray[2].innerHTML = "";
  elementArray[3].innerHTML = "";
  elementArray[4].innerHTML = "";
  elementArray[5].innerHTML = "";
  elementArray[6].innerHTML = "";
  elementArray[7].innerHTML = "";
  elementArray[8].innerHTML = "";
  myTurn = "";
}

const checkWon = (value, player) => {
  let won = false;

  if (
    gameState[0] === player &&
    gameState[1] === player &&
    gameState[2] === player
  ) {
    won = true;
  }
  if (
    gameState[3] === player &&
    gameState[4] === player &&
    gameState[5] === player
  ) {
    won = true;
  }
  if (
    gameState[6] === player &&
    gameState[7] === player &&
    gameState[8] === player
  ) {
    won = true;
  }
  if (
    gameState[0] === player &&
    gameState[3] === player &&
    gameState[6] === player
  ) {
    won = true;
  }
  if (
    gameState[1] === player &&
    gameState[4] === player &&
    gameState[7] === player
  ) {
    won = true;
  }
  if (
    gameState[2] === player &&
    gameState[5] === player &&
    gameState[8] === player
  ) {
    won = true;
  }
  if (
    gameState[0] === player &&
    gameState[4] === player &&
    gameState[8] === player
  ) {
    won = true;
  }
  if (
    gameState[2] === player &&
    gameState[4] === player &&
    gameState[6] === player
  ) {
    won = true;
  }
  if (won) {
    data = {
      event: "END",
      message: {
        index: value,
        player: player,
      },
      signal: `${player} is a winner. Play again?`,
      player: player,
    };
    socket.send(JSON.stringify(data));
    swal("great job!", "you win", "success");
    reset();
  }
  endGame();
};

// set the Oppoent cursor

const setCursor = (index, value) => {
  let data = {
    event: "MOVE",
    message: {
      index: index,
      player: value,
    },
  };

  if (gameState[parseInt(index)] == "") {
    if (myTurn != value || myTurn == "") {
      myTurn = value;
      gameState[parseInt(index)] = value;
      elementArray[parseInt(index)].innerHTML = value;
      socket.send(JSON.stringify(data));
      checkWon(index, value);
    } else {
      alert("Wait for other to place the move");
    }
  } else {
    alert("you can't fill this place");
  }
};

const setAnothercursor = (index, value) => {
  myTurn = value;
  gameState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
};

// connect the socket connecting
socket.onopen = function (e) {
  console.log("socket connected");
};

// check what data is sending through Socket

socket.onmessage = function (e) {
  let data = JSON.parse(e.data);
  data = data["payload"];
  // console.log(data);
  message = data["message"];

  // check the data event is MOVE or END

  if (data["event"] == "MOVE" && message["player"] != char_choice) {
    // if event is move then Processe the data diffrent Client
    setAnothercursor(message["index"], message["player"]);
  }
  // if event is END Stop the game
  else if (data["event"] == "END" && message["player"] != char_choice) {
    swal("sorry", "you are lost", "error");
    reset();
  } else if (data["event"] == "OVER") {
    swal("game over!", " No one Wins this time", "warning");
    reset();
  }
  // console.log(message);
};
socket.onclose = function (e) {
  console.log("socket disconnected");
};
