const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("test", function(data){
    console.log(data);
    for (var key in data) {
        document.getElementById(key).innerText =  data[key];
        console.log(key);
    }
})