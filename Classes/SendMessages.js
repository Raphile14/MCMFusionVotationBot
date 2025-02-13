const request = require('request');

module.exports = class SendMessages {
    constructor(token) {
        this.urlPOST = "https://graph.facebook.com/v2.6/me/messages";
        this.urlResults = "https://mcmfusionvotationbot.herokuapp.com/";
        this.token = token;
    }
    sendText(sender, text) {
        let messageData;
        if (text === "Information") {
            messageData = {text: "Frequently Asked Questions:\n\n" +
            "1.) This Bot is used to assist in the voting process of the #MCMFusionTechnicity\n" +
            "2.) Voters can only vote once. Make it count! You can't change your vote!\n" + 
            "3.) Live voting count can be found here: " + this.urlResults};
        }
        else if (text === "Vote Success") {
            messageData = {text: "Successfully submitted your vote! Thank you!"}
        }   
        else if (text === "Vote Fail") {
            messageData = {text: "Vote failed! You already voted for this category!"}
        } 
        request({
            url: this.urlPOST,
            qs: {access_token : this.token},
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
                // console.log(response.body.error);
                console.log("response body error");
            }
        });
    }

    sendButton(sender, data) {        
        request({
            url: this.urlPOST,
            qs: {access_token : this.token},
            method: "POST",
            json: {
                recipient: {id: sender},
                message: {
                    attachment: {
                        type: "template",
                        payload: {
                            template_type: "button",
                            text: data.b_title,
                            buttons: [
                                {
                                    type: "postback",
                                    title: data.b1_title,
                                    payload: data.b1_payload
                                },
                                {
                                    type: "postback",
                                    title: data.b2_title,
                                    payload: data.b2_payload
                                },
                                {
                                    type: "postback",
                                    title: data.b3_title,
                                    payload: data.b3_payload
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
                // console.log(response.body.error);
                console.log("response body error");
            }
        });
    }

    sendQueryButton(sender) {
        request({
            url: this.urlPOST,
            qs: {access_token : this.token},
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
                                    url: this.urlResults,
                                    title: "Check Votation Results!"
                                },
                                {
                                    type: "postback",
                                    title: "Vote Candidates!",
                                    payload: "vote"
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
                // console.log(response.body.error);
                console.log("response body error");
            }
        }); 
    }    
}