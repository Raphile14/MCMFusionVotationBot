// 'use strict'

// Requirements
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const Voter = require('./Classes/Voter.js');
const Config = require('./Classes/Config.json');
const VDatabase = require('./Classes/VoteDatabase.js');
const sm = require('./Classes/SendMessages.js');

// Initialization
const app = express();
app.set('port', (process.env.PORT || 5000));

// Cached Storage
let Voters = [];
let cacheConfigJSON = [];
let cacheVotingPayloads = [];
let categories = ["shsShowStopper", "cShowStopper", "shsFlicksAndChill", "cFlicksAndChill"];

// Variables
let token = process.env.PAGE_ACCESS_TOKEN || "test";
let VoteDatabase = new VDatabase(categories);
let SendMessages = new sm(token);

// TODO: Use these entries to automate website generation
let cacheSSSHSEntries = [];
let cacheSSCEntries = [];
let cacheFACSHSEntries=[];
let cacheFACCEntries = [];

// Read to storage Config JSON
for (var key in Config) {
    cacheConfigJSON[key] = Config[key];
    if (cacheConfigJSON[key].b1_payload.includes("facSHSVote") || cacheConfigJSON[key].b1_payload.includes("facCVote")
    || cacheConfigJSON[key].b1_payload.includes("ssCVote") || cacheConfigJSON[key].b1_payload.includes("ssSHSVote")) {
        cacheVotingPayloads.push(cacheConfigJSON[key].b1_payload);
    }
    if (key.includes("ssC")) {
        cacheSSCEntries.push(key);
    }
    else if (key.includes("ssSHS")) {
        cacheSSSHSEntries.push(key);
    }
    else if (key.includes("facC")) {
        cacheFACCEntries.push(key);
    }
    else if (key.includes("facSHS")) {
        cacheFACSHSEntries.push(key);
    }
}
console.log(cacheFACCEntries);
console.log(cacheFACSHSEntries);
console.log(cacheSSCEntries);
console.log(cacheSSSHSEntries);

// Check or generate xlsx database
VoteDatabase.checkDatabase();

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

// Make Database file downloadable
app.get('/download', function(req, res){
    const file = `${__dirname}/Data/MCMFusionTechnicityVotationLogs.xlsx`;
    res.download(file);
});

// When a message is received
app.post('/webhook/', function(req, res){
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++){
        let event = messaging_events[i];
        let sender = event.sender.id;

        // Check if Payload
        if (event.postback) {
            let payload = JSON.stringify(event.postback.payload);

            // If User is asking for Information
            if (payload == "\"information_query\"") {
                SendMessages.sendText(sender, "Information");
            }

            // Back to Main Menu
            else if (payload == "\"vote_back_main_menu\"") {
                SendMessages.sendQueryButton(sender);
            }

            else {
                // Other Commands
                // Button Variables
                let query = payload.replace(/['"]+/g, '');
                let b_title = cacheConfigJSON[query].title;
                let b1_title = cacheConfigJSON[query].b1_title;                
                let b1_payload = cacheConfigJSON[query].b1_payload;
                let b2_title = cacheConfigJSON[query].b2_title;
                let b2_payload = cacheConfigJSON[query].b2_payload;
                let b3_title = cacheConfigJSON[query].b3_title;
                let b3_payload = cacheConfigJSON[query].b3_payload;

                let data = {
                    b_title: b_title,
                    b1_title: b1_title,
                    b1_payload: b1_payload,
                    
                    b2_title: b2_title,
                    b2_payload: b2_payload,

                    b3_title: b3_title,
                    b3_payload: b3_payload
                }
                SendMessages.sendButton(sender, data);                            
            }            
        }

        // Check for Normal Message
        else if (event.message && event.message.text) {         
            
            // Send the Query Buttons
            SendMessages.sendQueryButton(sender);       
        }
    }
    res.sendStatus(200);
});

// // Functions
// function sendText(sender, text) {
//     let messageData;
//     if (text === "Information") {
//         messageData = {text: "Frequently Asked Questions:\n\n" +
//         "1.) This Bot is used to assist in the voting process of the #MCMFusionTechnicity\n" +
//         "2.) Voters can only vote once. Make it count! You can't change your vote!\n" + 
//         "3.) Live voting count can be found here: " + urlResults};
//     }   
//     request({
//         url: urlPOST,
//         qs: {access_token : token},
//         method: "POST",
//         json: {
//             recipient: {id: sender},
//             message: messageData
//         }
//     }, Utility.errorMessage(error, response, body));
// }

// For Specialized Buttons
// function sendButton(sender, data) {        
//     request({
//         url: urlPOST,
//         qs: {access_token : token},
//         method: "POST",
//         json: {
//             recipient: {id: sender},
//             message: {
//                 attachment: {
//                     type: "template",
//                     payload: {
//                         template_type: "button",
//                         text: data.b_title,
//                         buttons: [
//                             {
//                                 type: "postback",
//                                 title: data.b1_title,
//                                 payload: data.b1_payload
//                             },
//                             {
//                                 type: "postback",
//                                 title: data.b2_title,
//                                 payload: data.b2_payload
//                             },
//                             {
//                                 type: "postback",
//                                 title: data.b3_title,
//                                 payload: data.b3_payload
//                             }
//                         ]
//                     }
//                 }
//             }
//         }
//     }, Utility.errorMessage(error, response, body));
// }

// For Main Button
// function sendQueryButton(sender) {
//     request({
//         url: urlPOST,
//         qs: {access_token : token},
//         method: "POST",
//         json: {
//             recipient: {id: sender},
//             message: {
//                 attachment: {
//                     type: "template",
//                     payload: {
//                         template_type: "button",
//                         text: "Hi there, Malayan! What do you want to do?",
//                         buttons: [
//                             {
//                                 type: "postback",
//                                 title: "FAQ",
//                                 payload: "information_query"
//                             },
//                             {
//                                 type: "web_url",
//                                 url: urlResults,
//                                 title: "Check Votation Results!"
//                             },
//                             {
//                                 type: "postback",
//                                 title: "Vote Candidates!",
//                                 payload: "vote"
//                             }
//                         ]
//                     }
//                 }
//             }
//         }
//     }, Utility.errorMessage(error, response, body)); 
// }

app.listen(app.get('port'), function(){
    console.log("Running on Port: " + app.get('port'));
})