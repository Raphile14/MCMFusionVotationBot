const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("test", function(data){
    console.log("Received a score update!")
    document.getElementById(data.name).innerText = data.score;
})