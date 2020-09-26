const socket = io();

socket.on("usersOnline", function(data){
    document.getElementById("usersConnected").innerText =  data.number;
});

socket.on("test", function(data){
    console.log("Received a score update!")
    console.log(data);
    console.log(data.cacheVoteCount);
    // console.log(data[0]);
    for (var key in data.cacheVoteCount) {
        document.getElementById(key).innerText =  data.cacheVoteCount[key];
        console.log(key);
    }
})