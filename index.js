// 'use strict'

// Requirements
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

// Initialization
const app = express();
app.set('port', (process.env.PORT || 5000));

// Variables
let token = process.env.PAGE_ACCESS_TOKEN;

// Allows the process of data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Client Use
app.use(express.static(__dirname + '/client'));

// ROUTES
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Facebook
app.get('/webhook/', function(req, res){
    if (req.query['hub.verify_token'] === "april142000") {
        res.send(req.query['hub.challenge']);
    }
    res.send("Wrong token");
});

// When a message is received
app.post('/webhook/', function(req, res){
    console.log("received something");
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;
        if (event.message && event.message.text) {
            let text = event.message.text;
            // sendText(sender, "Text Echo: " + text.substring(0, 100));
            sendButton(sender, "Text Echo: " + text.substring(0, 100));
        }
    }
    res.sendStatus(200);
});

// Functions
function sendText(sender, text) {
    let messageData = {text: "sender: " + sender + " | text: " + text};
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

function sendButton(sender, text) {
    let messageData = {text: "sender: " + sender + " | text: " + text};
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token : token},
        method: "POST",
        json: {
            recipient: {id: sender},
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "What do you want to do next?",
                        buttons: [
                            {
                                type: "web_url",
                                url: "https://www.messenger.com",
                                title: "Visit Messenger"
                            }
                        ]
                    }
                }
            }
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
    console.log("Running on Port: " + app.get('port'));
})