"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/gameHub").build();

//Disable send button until connection is established
document.getElementById("createRoom").disabled = true;
document.getElementById("roomName").disabled = true;
var nameSet = false;

connection.on("UserCreated", function (userName) {
    var p = document.createElement("p");
    p.textContent = userName;
    p.id = "userName";
    document.getElementById("userName").replaceWith(p);
    userCreated();
});

function userCreated() {
    document.getElementById("createUser").hidden = true;
    document.getElementById("createRoom").disabled = false;
    document.getElementById("roomName").disabled = false;
    nameSet = true;
    updateOpenRooms();
}


connection.on("RoomCreated", function (roomName) {
    var p = document.createElement("p");
    p.textContent = roomName;
    p.id = "roomName";
    document.getElementById("roomName").replaceWith(p);
    document.getElementById("createRoom").hidden = true;
});

connection.on("GameConfirmed", function (roomName) {
    window.location.href = '/Game?roomName=' + roomName + '&userName=' + document.getElementById('userName').innerHTML + '&circlePlayer=0';
});

connection.on("CirclePlayer", function (roomName) {
    window.location.href = '/Game?roomName=' + roomName + '&userName=' + document.getElementById('userName').innerHTML + '&circlePlayer=1';
});

connection.on("UpdateOngoingGames", function (OngoingGames) {
    var ongoing = document.createElement("div");
    ongoing.id = "ongoing";
    OngoingGames.forEach(roomName => {
        var p = document.createElement("p");
        var btn = document.createElement("button");
        p.innerHTML = "Room name: " + roomName;
        btn.className = "watchGame";
        btn.name = roomName;
        btn.innerHTML = "Watch game";
        p.appendChild(btn);
        ongoing.appendChild(p);
    });
    document.querySelector("#ongoing").replaceWith(ongoing);
    addButtonsToOngoingGames();
});
var globalOpenRooms;
connection.on("UpdateOpenRooms", function (OpenRooms) {
    globalOpenRooms = OpenRooms;
    if (nameSet) {
        updateOpenRooms();
    }
});

function updateOpenRooms() {
    var roomsList = document.querySelector("#roomsList");
    var roomsDiv = document.createElement("div");
    roomsDiv.id = "roomsList";
    roomsDiv.innerHTML = "";
    globalOpenRooms.forEach(roomName => {
        if (roomName != document.getElementById("roomName").innerHTML) {
            var p = document.createElement("p");
            p.innerHTML = "Room name: " + roomName;
            p.className = "testOpenRoom";
            var btn = document.createElement("button");
            btn.textContent = "Join Room";
            btn.addEventListener('click', function() {
                // Create group in Hub
                connection.invoke("JoinRoom", roomName).catch(function (err) {
                    return console.error(err.toString());
                });
                // Go to game view
                window.location.href = '/Game?circlePlayer=1';
            }, false);
            p.appendChild(btn);
            roomsDiv.appendChild(p);
        }
    });
    roomsList.replaceWith(roomsDiv);
}

connection.start().then(function () {
    if(typeof ifNameFromOtherGame !== 'undefined') userCreated();
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("createUser").addEventListener("click", function (event) {
    var roomName = document.getElementById("userName").value;
    connection.invoke("CreateUser", roomName).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

document.getElementById("createRoom").addEventListener("click", function (event) {
    var roomName = document.getElementById("roomName").value;
    connection.invoke("CreateRoom", roomName).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

addButtonsToOngoingGames();

function addButtonsToOngoingGames() {
    var watchSelection = document.getElementsByClassName('watchGame');
    for(var i = 0; i < watchSelection.length; i++) {
      (function(index) {
        watchSelection[index].addEventListener("click", function(event) {
            // Hitta nuvarande rumsnamn
            var roomName = watchSelection[index].name;
            connection.invoke("WatchGame", roomName).catch(function (err) {
                return console.error(err.toString());
            });
            window.location.href = '/Watch?roomName=' + roomName;
    
            event.preventDefault();
         })
      })(i);
    }
}

var openRoomsSelection = document.getElementsByClassName('openRooms');
    for(var i = 0; i < openRoomsSelection.length; i++) {
      (function(index) {
        openRoomsSelection[index].addEventListener("click", function(event) {
            // Hitta nuvarande rumsnamn
            var roomName = openRoomsSelection[index].name;
            connection.invoke("JoinRoom", roomName).catch(function (err) {
                return console.error(err.toString());
            });    
            event.preventDefault();
         })
      })(i);
    }


var userSelection = document.getElementsByClassName('userUnit');
for(var i = 0; i < userSelection.length; i++) {
  (function(index) {
    userSelection[index].addEventListener("click", function(event) {
        // Hitta nuvarande användares userNumber
        var user = userSelection[index].name;
        // var message = document.getElementById("messageInput").value;
        connection.invoke("AskGame", user).catch(function (err) {
            return console.error(err.toString());
        });
        event.preventDefault();
     })
  })(i);
}
