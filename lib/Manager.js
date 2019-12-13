const Employee = require("./Employee");

class Manager extends Employee{
    constructor(name, id, email, officeNumber,rank=100){
        super(name, id, email);
        this.officeNumber = officeNumber;
        this.rank = rank;
    }

    getOfficeNumber(){
        return this.officeNumber;
    }

    getRank(){
        return this.rank;
    }
}

module.exports = Manager;