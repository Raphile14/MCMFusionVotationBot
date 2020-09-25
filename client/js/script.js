const socket = io();

socket.on("usersOnline", function(data){
    console.log("detected")
    document.getElementById("usersConnected").innerText =  data.number;
});