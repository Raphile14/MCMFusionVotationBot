'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.set('port', (process.env.PORT || 5000));

// Allows the process of data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// ROUTES
app.get('/', function(req, res){
    res.send("Hi I am a chatbot");
});

let token = process.env.PAGE_ACCESS_TOKEN;
console.log(token);

// Facebook
app.get('/webhook/', function(req, res){
    if (req.query['hub.verify_token'] === "april142000") {
        console.log("step 1");
        res.send(req.query['hub.challenge']);
    }
    console.log("step 1: fail");
    res.send("Wrong token");
});

app.post('/webhook/', function(req, res){
    console.log("received something");
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;
        if (event.message && event.message.text) {
            let text = event.message.text;
            sendText(sender, "Text Echo: " + text.substring(0, 100));
        }
    }
    res.sendStatus(200);
});

function sendText(sender, text) {
    let messageData = {text: text};
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token : token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: messageData
        }
    }, function (error, response, body) {
        if (error) {
            console.log("sending error");
        }
        else if (response.body.error) {
            console.log("response body error");
        }
    });
}

app.listen(app.get('port'), function(){
    console.log("running: port");
})