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
            console.log("FROM HOOK: " + text);
            console.log("Is Postback: " + event.postback);
            // Check if Payload
            if (event.postback) {
                let payload = JSON.stringify(event.postback.payload);
                console.log("Payload: " + payload);

                // If User is asking for Information
                if (payload === "\"information_query\"") {
                    sendText(sender, "Information");
                }

                // If User wants to vote
                else if (payload === "\"vote_query\"") {
                    sendButton(sender, "Vote");
                }

                // Back to Main Menu
                else if (payload === "\"vote_back_main_menu\"") {
                    sendButton(sender, "Any");
                }
            }
            
            // Send the Query Buttons
            else {
                sendButton(sender, "Any");
            }            
        }
    }
    res.sendStatus(200);
});

// Functions
function sendText(sender, text) {
    let messageData;
    if (text === "Information") {
        messageData = {text: "Frequently Asked Questions:\n" +
    "1.) This Bot is used to assist in the voting process of the #MCMFusionTechnicity\n" +
    "2.) Voters can only vote once. Make it count! You can't change your vote!" + 
    "3.) Live voting count can be found here: https://mcmfusionvotationbot.herokuapp.com/"};
    }   
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

function sendButton(sender, query) {
    if (query === "Any") {
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
                            text: "Hi there, Malayan! What do you want to do?",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "FAQ",
                                    payload: "information_query"
                                },
                                {
                                    type: "web_url",
                                    url: "https://mcmfusionvotationbot.herokuapp.com/",
                                    title: "Check Votation Results!"
                                },
                                {
                                    type: "postback",
                                    title: "Vote Candidates!",
                                    payload: "vote_query"
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
    else if (query === "Vote") {
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
                            text: "#MCMFusionTechnicity Vote! Choose Category",
                            buttons: [
                                {
                                    type: "postback",
                                    title: "MCMFlicks and Chill",
                                    payload: "vote_flicks_and_chill"
                                },
                                {
                                    type: "postback",
                                    title: "Show Stopper",
                                    payload: "vote_show_stopper"
                                },
                                {
                                    type: "postback",
                                    title: "Back to Main Menu!",
                                    payload: "vote_back_main_menu"
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

    console.log("FROM SEND");
    
}

app.listen(app.get('port'), function(){
    console.log("Running on Port: " + app.get('port'));
})