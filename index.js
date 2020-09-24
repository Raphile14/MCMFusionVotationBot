// 'use strict'

// Requirements
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const Voter = require('./Classes/Voter.js');
const Config = require('./Classes/Config.json');

// Initialization
const app = express();
app.set('port', (process.env.PORT || 5000));

// Variables
let token = process.env.PAGE_ACCESS_TOKEN;

// Cached Storage
let Voters = [];

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
    console.log(messaging_events);
    for (let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;

        // Check if Payload
        if (event.postback) {
            let payload = JSON.stringify(event.postback.payload);
            console.log("Payload: " + payload);
            console.log(payload == "information_query");

            // If User is asking for Information
            if (payload == "\"information_query\"") {
                sendText(sender, "Information");
            }

            // Back to Main Menu
            else if (payload == "\"vote_back_main_menu\"") {
                sendQueryButton(sender);
            }

            // Other Commands
            else {
                sendButton(sender, payload);
            }
        }

        // Check for Normal Message
        else if (event.message && event.message.text) {
            console.log("FROM HOOK: " + sender);           
            
            // Send the Query Buttons
            sendQueryButton(sender);       
        }
    }
    res.sendStatus(200);
});

// Functions
function sendText(sender, text) {
    let messageData;
    if (text === "Information") {
        messageData = {text: "Frequently Asked Questions:\n\n" +
    "1.) This Bot is used to assist in the voting process of the #MCMFusionTechnicity\n" +
    "2.) Voters can only vote once. Make it count! You can't change your vote!\n" + 
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

// For Specialized Buttons
function sendButton(sender, query) {
    // Vote Variables
    let b_title;
    let b1_title, b1_payload;
    let b2_title, b2_payload;
    let b3_title, b3_payload;

    // Vote Query
    if (query === "\"vote_query\"") {
        b_title = Config.vote.title;
        b1_title = Config.vote.b1_tittle;
        b1_payload = Config.vote.b1_payload;
        b2_title = Config.vote.b2_tittle;
        b2_payload = Config.vote.b2_payload;
        b3_title = Config.vote.b3_tittle;
        b3_payload = Config.vote.b3_payload;
    }

    // Flicks and Chill
    else if (query === "\"vote_flicks_and_chill\"") {
        b_title = Config.fac.title;
        b1_title = Config.fac.b1_tittle;
        b1_payload = Config.fac.b1_payload;
        b2_title = Config.fac.b2_tittle;
        b2_payload = Config.fac.b2_payload;
        b3_title = Config.fac.b3_tittle;
        b3_payload = Config.fac.b3_payload;
    }

    // Show Stopper
    else if (query === "\"vote_show_stopper\"") {
        b_title = Config.ss.title;
        b1_title = Config.ss.b1_tittle;
        b1_payload = Config.ss.b1_payload;
        b2_title = Config.ss.b2_tittle;
        b2_payload = Config.ss.b2_payload;
        b3_title = Config.ss.b3_tittle;
        b3_payload = Config.ss.b3_payload;
    }
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
                        text: b_title,
                        buttons: [
                            {
                                type: "postback",
                                title: b1_title,
                                payload: b1_payload
                            },
                            {
                                type: "postback",
                                title: b2_title,
                                payload: b2_payload
                            },
                            {
                                type: "postback",
                                title: b3_title,
                                payload: b3_payload
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

// For Main Button
function sendQueryButton(sender) {
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

app.listen(app.get('port'), function(){
    console.log("Running on Port: " + app.get('port'));
})