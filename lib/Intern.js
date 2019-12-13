const Employee = require("./Employee");

class Intern extends Employee{
    constructor(name, id, email, school,rank=10){
        super(name, id, email);
        this.school = school;
        this.rank = rank;
    }

    getSchool(){
        return this.school;
    }

    getRank(){
        return this.rank;
    }
}

module.exports = Intern;