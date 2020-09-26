const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("test", function(data){
    console.log("Received a score update!")
    console.log(data.count);
    // console.log(data[0]);
    for (var key in data.count) {
        document.getElementById(key).innerText =  data.count[key];
        console.log(key);
    }
})