const XLSX = require('xlsx');
const fs = require('fs');

module.exports = class VoteDatabase {
    constructor(categories) {
        this.categories = categories;
    }
    checkDatabase () {
        try {
            if (!fs.existsSync("./Data/MCMFusionTechnicityVotationLogs.xlsx")) {
                console.log("Database File Does not Exists");
                console.log("Creating Database File");
                let workbook = XLSX.utils.book_new();
                workbook.SheetNames = this.categories;
                // console.log(workbook);
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
}