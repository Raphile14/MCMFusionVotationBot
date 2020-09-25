const XLSX = require('xlsx');
const fs = require('fs');
const Config = require('./Config.json');

module.exports = class VoteDatabase {
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
    checkDatabase () {             
        try {
            if (!fs.existsSync("./Data/MCMFusionTechnicityVotationLogs.xlsx")) {
                console.log("Database File Does not Exists");
                console.log("Creating Database File");
                let workbook = XLSX.utils.book_new(); 
                workbook.Props = {
                    Title: "MCM Fusion: Technicity Votation Logs",
                    Subject: "Voting Logs",
                    Author: "Raphael Dalangin"
                }                
                // Convert format to xlsx compatible format
                let format = [["id", "team", "date"]];
                var ws = XLSX.utils.aoa_to_sheet(format);
                for (var sheets in this.categories) {
                    workbook.SheetNames.push(this.categories[sheets]);
                    workbook.Sheets[this.categories[sheets]] = ws;
                }              
                XLSX.writeFile(workbook, "Data/MCMFusionTechnicityVotationLogs.xlsx");
                console.log("Database File Successfully Created");                
            }
            else {
                console.log("Database File Already Exists!")
            }
        }
        catch (err) {
            console.log(err);
        }
    }
    readDatabase() {
        let storageVoters = this.Voters;
        let storageCategories = this.categories;
        let wb = XLSX.readFile("Data/MCMFusionTechnicityVotationLogs.xlsx", {cellDates: true});
        let ssSHS = wb.Sheets["ssSHS"];
        let ssC = wb.Sheets["ssC"];
        let facSHS = wb.Sheets["facSHS"];
        let facC = wb.Sheets["facC"];

        // Convert Data to JSON
        let json_ssSHS = XLSX.utils.sheet_to_json(ssSHS);
        let json_ssC = XLSX.utils.sheet_to_json(ssC);
        let json_facSHS = XLSX.utils.sheet_to_json(facSHS);
        let json_facC = XLSX.utils.sheet_to_json(facC);        

        // Store data to Voters Array
        // TODO: Add counter here
        let data_ssSHS = json_ssSHS.map(function(record){
            storageVoters[storageCategories[0]][record.id] = record;            
        });
        let data_ssC = json_ssC.map(function(record){
            storageVoters[storageCategories[1]][record.id] = record;
        });
        let data_facSHS = json_facSHS.map(function(record){
            storageVoters[storageCategories[2]][record.id] = record;
        });
        let data_facC = json_facC.map(function(record){
            storageVoters[storageCategories[3]][record.id] = record;
        });
    }
    submitVote(sender, payload) {
        let selectedCategory;
        // Find which Category "ssSHS", "ssC", "facSHS", "facC"
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
            let format = [["id", "team", "date"]];
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            this.Voters[selectedCategory][sender] = [sender, payload, date];
            for (var people in this.Voters[selectedCategory]) {
                format = format.concat([this.Voters[selectedCategory][people]]);
            }
            // TODO: Add counter here
            // TODO: Save to database here
            let wb = XLSX.readFile("Data/MCMFusionTechnicityVotationLogs.xlsx", {cellDates: true});
            // console.log(this.Voters[selectedCategory]);
            console.log(format);
            let newData = XLSX.utils.aoa_to_sheet(format);
            console.log(newData);
            wb.Sheets[selectedCategory] = newData;            
            XLSX.writeFile(wb, "Data/MCMFusionTechnicityVotationLogs.xlsx");
            console.log("Database Updated by Vote");
            return true;
        }
        return false;
    }
}