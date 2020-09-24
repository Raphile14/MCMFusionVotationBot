module.exports = class Voter {
    constructor(id) {
        this.id = id;

        // SHS Votes
        this.votedMrStaycationS = false;
        this.votedMsStaycationS = false;
        this.votedVotVS = false;
        this.votedShowStopperS = false;
        this.votedFlicksAndChillS = false;

        // College Votes
        this.votedMrStaycationC = false;
        this.votedMsStaycationC = false;
        this.votedVotVC = false;
        this.votedShowStopperC = false;
        this.votedFlicksAndChillC = false;
    }
}