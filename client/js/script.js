const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("test", function(data){
    console.log("Received a score update!")
    console.log(data[0]);
    for (var key in data[0]) {
        document.getElementById(key).innerText =  data[0][key];
        console.log(key);
    }
})