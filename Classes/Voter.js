module.exports = class Voter {
    constructor(id, category) {
        this.id = id;
        this.category = category;
        this.voted = false;
    }
}