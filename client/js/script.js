const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("current", function(data){
    document.getElementById(data.name).innerText = data.score;
});
