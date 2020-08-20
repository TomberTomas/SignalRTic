var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

    connection.on("MoveMade", function (circles, crosses) {
        drawMarkersOnMove(circles, crosses);
        checkWin();
    });

    connection.on("StartNewGame", function () {
        newGame();
    });

    connection.on("GameEnded", function () {
        alert("Player ended game");
        window.location.href = '/Index';
    });

    connection.start().then(function () {
        drawMarkers();
        connection.invoke("EnterWatchGame", roomName).catch(function (err) {
            return console.error(err.toString());
        });
    }).catch(function (err) {
        return console.error(err.toString());
    });

var stats = document.getElementById("stats");
var instructions = document.getElementById("instructions");

var btnLeaveGame = document.getElementById("btnLeaveGame");
btnLeaveGame.addEventListener('click', function() {
    window.location.href = '/Index';
}, false);

var circleWins = document.querySelector('#circleWins');
var crossWins = document.querySelector('#crossWins');
var drawWins = document.querySelector('#drawWins');
var numGames = document.querySelector('#numGames');
var circlePoints = circleWins.innerHTML;
var crossPoints = crossWins.innerHTML;
var drawPoints = drawWins.innerHTML;
var numberOfGames = numGames.innerHTML;

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

function drawMarkers() {
    circleArray.forEach(x => draw("circle", x));
    crossArray.forEach(x => draw("cross", x));
}

function drawMarkersOnMove(circles, crosses) {
    circles.forEach(x => draw("circle", x));
    crosses.forEach(x => draw("cross", x));
    drawnSquares = circles.concat(crosses);
}

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
var circleTurn = true;
var squareNumber = false;

var drawnSquares = [];
var drawnCircles = [];
var drawnCrosses = [];
function draw(player, squareNumber) {
    if(player == "circle") {
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
    if(player == "cross") {
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
    }
    if(drawnSquares.length == 9) {
        roundFinished("draw");
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
    if (winner == "circle") circlePoints++;
    if (winner == "cross") crossPoints++;
    if (winner == "draw") drawPoints++;
    numberOfGames++;
    circleWins.innerHTML = circlePoints;
    crossWins.innerHTML = crossPoints;
    drawWins.innerHTML = drawPoints;
    numGames.innerHTML = numberOfGames;
}
