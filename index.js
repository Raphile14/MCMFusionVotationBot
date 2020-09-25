// 'use strict'

// Requirements
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Config = require('./Classes/Config.json');
const VDatabase = require('./Classes/VoteDatabase.js');
const sm = require('./Classes/SendMessages.js');
const vl = require('./Classes/VotingLogic.js');
const { stat } = require('fs');

// Initialization
const app = express();
app.set('port', (process.env.PORT || 5000));

// Allows the process of data
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Cached Storage
let Voters = [];
let cacheConfigJSON = []; // Contains data from participants
let cacheVotingPayloads = []; // Contains Voting Payload Keywords
let categories = ["ssSHS", "ssC", "facSHS", "facC"];

// TODO: Use these entries to automate website generation
let cacheSSSHSEntries = []; // SHS Show Stopper Entries
let cacheSSCEntries = []; // College Show Stopper Entries
let cacheFACSHSEntries = []; // SHS Flicks and Chill Entries
let cacheFACCEntries = []; // College Flicks and Chill Entries
let cacheAllEntries = []; // All Entries

// Variables
let token = process.env.PAGE_ACCESS_TOKEN || "test";
let VoteDatabase = new VDatabase(categories);
let SendMessages = new sm(token);
let VotingLogic = new vl(Voters, categories, cacheConfigJSON, cacheVotingPayloads, cacheAllEntries, cacheSSSHSEntries, cacheSSCEntries, cacheFACSHSEntries, cacheFACCEntries);

// Initiating Commands
VotingLogic.init();
VotingLogic.readParticipants(); // Read Config Participants
VoteDatabase.checkDatabase(); // Check or generate xlsx database

// Debug Logs
// console.log(cacheFACCEntries);
// console.log(cacheFACSHSEntries);
// console.log(cacheSSCEntries);
// console.log(cacheSSSHSEntries);
console.log(cacheAllEntries);
console.log(cacheVotingPayloads);
console.log(Voters);

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
            let payload = JSON.stringify(event.postback.payload).replace(/['"]+/g, '');
            // If User is asking for Information
            if (payload == "information_query") {
                SendMessages.sendText(sender, "Information");
            }
            // Back to Main Menu
            else if (payload == "vote_back_main_menu") {
                SendMessages.sendQueryButton(sender);
            }
            // If Payload is a Vote            
            else if (cacheVotingPayloads.includes(payload)) {
                let status = VotingLogic.submitVote(sender, payload);
                if (status) SendMessages.sendText(sender, "Vote Success");
                else SendMessages.sendText(sender, "Vote Fail");          
            }
            // // Voted College MCMFlicks and Chill
            // // Voted SHS MCMFlicks and Chill
            // else if (cacheFACSHSEntries.includes(payload)) {
                
            // }
            // // Voted College Show Stopper
            // else if (cacheSSCEntries.includes(payload)) {
                
            // }
            // // Voted SHS Show Stopper
            // else if (cacheSSSHSEntries.includes(payload)) {
                
            // }
            else {
                // Other Commands
                // Button Variables
                let b_title = cacheConfigJSON[payload].title;
                let b1_title = cacheConfigJSON[payload].b1_title;                
                let b1_payload = cacheConfigJSON[payload].b1_payload;
                let b2_title = cacheConfigJSON[payload].b2_title;
                let b2_payload = cacheConfigJSON[payload].b2_payload;
                let b3_title = cacheConfigJSON[payload].b3_title;
                let b3_payload = cacheConfigJSON[payload].b3_payload;

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

app.listen(app.get('port'), function(){
    console.log("Running on Port: " + app.get('port'));
})