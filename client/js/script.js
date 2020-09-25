const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("test", function(){
    console.log("test received");
})