var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

    connection.on("MoveMade", function (squareNumber) {
        draw(squareNumber);
        circleTurn = !circleTurn;
        document.querySelector('#instructions').innerHTML = circleTurn ? "Circle's turn!" : "Cross's turn!";
        tempBreak = false;
        checkWin();
    });

    connection.on("RoundFinished", function (winner) {
        if (winner == "circle") circlePoints++;
        if (winner == "cross") crossPoints++;
        if (winner == "draw") drawPoints++;
        numberofGames++;

        statsCircle.innerHTML = circlePoints;
        statsCross.innerHTML = crossPoints;
        statsDraws.innerHTML = drawPoints;
        numGames.innerHTML = numberofGames;
        
        var statsMessage = "In Room " + roomName + " Circle won: " + circlePoints + " times and cross won: " + crossPoints + " times";
        connection.invoke("UpdateStats", roomName, statsMessage).catch(function (err) {
            return console.error(err.toString());
        });
    });

    connection.on("YesToNewGame", function () {
        btnAskNewGame.disabled = true;
        btnStartNewGame.disabled = false;
    });

    connection.on("StartNewGame", function () {
        newGame();
        btnAskNewGame.disabled = true;
        btnStartNewGame.disabled = true;
    });

    connection.on("GameEnded", function () {
        alert("Player ended game");
        window.location.href = '/Index?userName=' + userName;
    });

    connection.start().then(function () {
        connection.invoke("EnterRoom", roomName, userName, circlePlayer).catch(function (err) {
            return console.error(err.toString() + roomName + userName + circlePlayer);
        });
    }).catch(function (err) {
        return console.error(err.toString());
    });

var stats = document.getElementById("stats");
var statsCircle = document.getElementById("statsCircle");
var statsCross = document.getElementById("statsCross");
var statsDraws = document.getElementById("statsDraws");
var instructions = document.getElementById("instructions");
var numGames = document.getElementById("numGames");

var btnAskNewGame = document.getElementById("btnAskNewGame");
btnAskNewGame.disabled = true;
btnAskNewGame.addEventListener('click', function() {
    btnAskNewGame.disabled = true;
    connection.invoke("AskNewGame", roomName).catch(function (err) {
        return console.error(err.toString());
    });
}, false);

var btnStartNewGame = document.getElementById("btnStartNewGame");
btnStartNewGame.disabled = true;
btnStartNewGame.addEventListener('click', function() {
    connection.invoke("YesToNewGame", roomName).catch(function (err) {
        return console.error(err.toString());
    });
}, false);

var btnLeaveGame = document.getElementById("btnLeaveGame");
btnLeaveGame.addEventListener('click', function() {
    connection.invoke("LeaveGame", roomName).catch(function (err) {
        return console.error(err.toString());
    });
}, false);

var circlePoints = 0;
var crossPoints = 0;
var drawPoints = 0;
var numberofGames = 0;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

function newBoard() {
    ctx.clearRect(0, 0, 300, 300);
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(100, 300);
    ctx.stroke();
    ctx.moveTo(200, 0);
    ctx.lineTo(200, 300);
    ctx.stroke();
    ctx.moveTo(0, 100);
    ctx.lineTo(300, 100);
    ctx.stroke();
    ctx.moveTo(0, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
}

newBoard();

var tempBreak = false;

function drawCircle(centerX, centerY) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, 32, 0, 2 * Math.PI);
    ctx.stroke();
}


function drawCross(centerX, centerY) {
    ctx.beginPath();
    ctx.moveTo(centerX-30, centerY-30);
    ctx.lineTo(centerX+30, centerY+30);
    ctx.stroke();
    ctx.moveTo(centerX+30, centerY-30);
    ctx.lineTo(centerX-30, centerY+30);
    ctx.stroke();
}

var roomName = document.querySelector('#roomName').innerHTML;
var userName = document.querySelector('#userName').innerHTML;
var circleTurn = true;

document.addEventListener('click', on_canvas_click);
var squareNumber = false;

function on_canvas_click(ev) {
    if(circlePlayer&&
    circleTurn&&
    !tempBreak || 
    !circlePlayer&&
    !circleTurn&&
    !tempBreak) {
        tempBreak = true;
        var x = ev.clientX - canvas.offsetLeft;
        var y = ev.clientY - canvas.offsetTop;
        if(x >= 0 && x < 300 && y >= 0 && y < 300) {
            if(x>=0 && x<100 && y>=0 && y<100) squareNumber = 1;
            if(x>=100 && x<200 && y>=0 && y<100) squareNumber = 2;
            if(x>=200 && x<300 && y>=0 && y<100) squareNumber = 3;
            if(x>=0 && x<100 && y>=100 && y<200) squareNumber = 4;
            if(x>=100 && x<200 && y>=100 && y<200) squareNumber = 5;
            if(x>=200 && x<300 && y>=100 && y<200) squareNumber = 6;
            if(x>=0 && x<100 && y>=200 && y<300) squareNumber = 7;
            if(x>=100 && x<200 && y>=200 && y<300) squareNumber = 8;
            if(x>=200 && x<300 && y>=200 && y<300) squareNumber = 9;
            if(drawnSquares.includes(squareNumber)) {
                tempBreak = false;
            } else {
                connection.invoke("MakeMove", roomName, squareNumber, circlePlayer).catch(function (err) {
                    return console.error(err.toString());
                });
            }
        }
        tempBreak = false;
    }
}

    
    var drawnSquares = [];
    var drawnCircles = [];
    var drawnCrosses = [];
    function draw(squareNumber) {
        drawnSquares.push(squareNumber);
        if(circleTurn) {
            drawnCircles.push(squareNumber);
            switch(squareNumber) {
                case 1: drawCircle(50,50); break;
                case 2: drawCircle(150,50); break;
                case 3: drawCircle(250,50); break;
                case 4: drawCircle(50,150); break;
                case 5: drawCircle(150,150); break;
                case 6: drawCircle(250,150); break;
                case 7: drawCircle(50,250); break;
                case 8: drawCircle(150,250); break;
                case 9: drawCircle(250,250); break;

            }
        }
        if(!circleTurn) {
            drawnCrosses.push(squareNumber);
            switch(squareNumber) {
                case 1: drawCross(50,50); break;
                case 2: drawCross(150,50); break;
                case 3: drawCross(250,50); break;
                case 4: drawCross(50,150); break;
                case 5: drawCross(150,150); break;
                case 6: drawCross(250,150); break;
                case 7: drawCross(50,250); break;
                case 8: drawCross(150,250); break;
                case 9: drawCross(250,250); break;
            
            }
        }
    }

    function checkWin() {
        if(checkSpecificWins(drawnCircles, 1, 2, 3) ||
        checkSpecificWins(drawnCircles, 4, 5, 6) ||
        checkSpecificWins(drawnCircles, 7, 8, 9) ||
        checkSpecificWins(drawnCircles, 1, 4, 7) ||
        checkSpecificWins(drawnCircles, 2, 5, 8) ||
        checkSpecificWins(drawnCircles, 3, 6, 9) ||
        checkSpecificWins(drawnCircles, 1, 5, 9) ||
        checkSpecificWins(drawnCircles, 3, 5, 7)
        ) {
            roundFinished("circle");
            btnAskNewGame.disabled = false;
        }
        if(checkSpecificWins(drawnCrosses, 1, 2, 3) ||
        checkSpecificWins(drawnCrosses, 4, 5, 6) ||
        checkSpecificWins(drawnCrosses, 7, 8, 9) ||
        checkSpecificWins(drawnCrosses, 1, 4, 7) ||
        checkSpecificWins(drawnCrosses, 2, 5, 8) ||
        checkSpecificWins(drawnCrosses, 3, 6, 9) ||
        checkSpecificWins(drawnCrosses, 1, 5, 9) ||
        checkSpecificWins(drawnCrosses, 3, 5, 7)
        ) {
            roundFinished("cross");
            btnAskNewGame.disabled = false;
        }
        if(drawnSquares.length == 9) {
            roundFinished("draw");
            btnAskNewGame.disabled = false;
        }
    }

    function checkSpecificWins(arr, squareOne, squareTwo, squareThree) {
        return (arr.includes(squareOne) && arr.includes(squareTwo) && arr.includes(squareThree));
    }

    function newGame() {
        drawnSquares = [];
        drawnCircles = [];
        drawnCrosses = [];
        squareNumber = false;
        newBoard();
        tempBreak = false;
    }

    function roundFinished(winner) {
        tempBreak = true;
        if(circlePlayer){
            connection.invoke("RoundFinished", roomName, winner).catch(function (err) {
                return console.error(err.toString());
            });
        }
    }
