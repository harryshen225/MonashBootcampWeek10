const Employee = require("./Employee");

class Engineer extends Employee{
    constructor(name, id, email,github,rank=50){
        super(name, id, email);
        this.github = github;
        this.rank = rank;
    }

    getGithub(){
        return this.github;
    }

    getRank(){
        return this.rank;
    }
}

module.exports = Engineer;