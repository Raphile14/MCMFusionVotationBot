const Config = require('./Config.json');

module.exports = class VotingLogic {
    constructor(cacheConfigJSON, cacheVotingPayloads, cacheAllEntries, cacheSSSHSEntries, cacheSSCEntries, cacheFACSHSEntries, cacheFACCEntries) {
        this.cacheConfigJSON = cacheConfigJSON;
        this.cacheVotingPayloads = cacheVotingPayloads;
        this.cacheAllEntries = cacheAllEntries;
        this.cacheSSSHSEntries = cacheSSSHSEntries;
        this.cacheSSCEntries = cacheSSCEntries;
        this.cacheFACSHSEntries = cacheFACSHSEntries;
        this.cacheFACCEntries = cacheFACCEntries;

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
}