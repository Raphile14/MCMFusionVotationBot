const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("scoreUpdate", function(data){
    for (var key in data.count) {
        document.getElementById(key).innerText =  data.count[key];
        console.log(key);
    }
})