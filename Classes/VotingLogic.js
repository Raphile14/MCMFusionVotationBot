const Config = require('./Config.json');
const Voter = require('./Voter.js');

module.exports = class VotingLogic {
    constructor(Voters, categories, cacheConfigJSON, cacheVotingPayloads, cacheAllEntries, cacheSSSHSEntries, cacheSSCEntries, cacheFACSHSEntries, cacheFACCEntries) {
        this.Voters = Voters;
        this.categories = categories;
        this.cacheConfigJSON = cacheConfigJSON;
        this.cacheVotingPayloads = cacheVotingPayloads;
        this.cacheAllEntries = cacheAllEntries;
        this.cacheSSSHSEntries = cacheSSSHSEntries;
        this.cacheSSCEntries = cacheSSCEntries;
        this.cacheFACSHSEntries = cacheFACSHSEntries;
        this.cacheFACCEntries = cacheFACCEntries;

    }
    // Initialize Voting Logic
    init() {
        // Make Voter Keys from categories
        for (var key in this.categories) {
            this.Voters[this.categories[key]] = [];
        }
    }
    // Read to storage Config JSON
    readParticipants() {
        for (var key in Config) {
            this.cacheConfigJSON[key] = Config[key];
            if (this.cacheConfigJSON[key].b1_payload.includes("facSHSVote") || this.cacheConfigJSON[key].b1_payload.includes("facCVote") || this.cacheConfigJSON[key].b1_payload.includes("ssCVote") || this.cacheConfigJSON[key].b1_payload.includes("ssSHSVote")) {
                this.cacheVotingPayloads.push(this.cacheConfigJSON[key].b1_payload);
            }
            if (key.includes("ssC")) {
                this.cacheSSCEntries.push(key);
                this.cacheAllEntries.push(key);
            }
            else if (key.includes("ssSHS")) {
                this.cacheSSSHSEntries.push(key);
                this.cacheAllEntries.push(key);
            }
            else if (key.includes("facC")) {
                this.cacheFACCEntries.push(key);
                this.cacheAllEntries.push(key);
            }
            else if (key.includes("facSHS")) {
                this.cacheFACSHSEntries.push(key);
                this.cacheAllEntries.push(key);
            }
        }
    }
    submitVote(sender, payload) {
        let selectedCategory;
        // Find which Category
        if (payload.includes(this.categories[0])) {
            selectedCategory = this.categories[0];
        } 
        else if (payload.includes(this.categories[1])) {
            selectedCategory = this.categories[1];
        } 
        else if (payload.includes(this.categories[2])) {
            selectedCategory = this.categories[2];
        } 
        else if (payload.includes(this.categories[3])) {
            selectedCategory = this.categories[3];
        } 
        
        if (!this.Voters[selectedCategory][sender]) {
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            this.Voters[selectedCategory][sender] = new Voter(payload, date);
            // TODO: Add counter here
            // TODO: Save to database here
            console.log(this.Voters);
            return true;
        }
        return false;
    }
}