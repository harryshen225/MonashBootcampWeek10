const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const readFileAync = util.promisify(fs.readFile);
const writeFileAync = util.promisify(fs.writeFile);

const managerTemplate = fs.readFileSync("./templates/manager.html","utf8");
const engineerTemplate = fs.readFileSync("./templates/engineer.html","utf8");
const internTemplate = fs.readFileSync("./templates/intern.html","utf8");

async function getSingleEmployeeInfo() {
    const employeeInfo = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "Full Name: "
        },

        {
            type: "input",
            name: "id",
            message: "ID: "
        },
        {
            type: "input",
            name: "email",
            message: "Email: "
        },
        {
            type: "list",
            name: "role",
            message: "Role: ",
            choices: [
                "Manager",
                "Engineer",
                "Intern"
            ]
        },
        {
            when: response => (response.role === "Engineer") ? true : false,
            type: "input",
            name: "gitHub",
            message: "GitHub: "
        },
        {
            when: response => (response.role === "Manager") ? true : false,
            type: "input",
            name: "officeNumber",
            message: "Office Number: "
        },
        {
            when: response => (response.role === "Intern") ? true : false,
            type: "input",
            name: "school",
            message: "School: "
        }
    ]);
    return employeeInfo;
}

async function createEmployees() {
    let createMoreUser = true;
    const users = [];
    while (createMoreUser) {
        const user = await getSingleEmployeeInfo();
        switch (user.role){
            case "Manager":
                    users.push(new Manager(user.name, user.id, user.email, user.officeNumber));
                    break;
            case "Engineer":
                    users.push(new Engineer(user.name, user.id, user.email, user.gitHub));
                    break;
            case "Intern":
                    users.push( new Intern(user.name, user.id, user.email, user.school));
                    break;
        }
        const confirmRes = await inquirer.prompt([
            {
                type: "confirm",
                name: "createMoreUser",
                message: "Create More User? "
            }
        ]);
        createMoreUser = confirmRes.createMoreUser
    }
    return users;
}

function generateSingleCard(employee){
    switch (employee.getRole()){
        case "Manager":
            return eval("`"+managerTemplate +"`");
        case "Engineer":
            return eval("`"+engineerTemplate +"`");
        case "Intern":
            return eval("`"+internTemplate +"`");
    }
}

function generateEmployeeCards(employeeArray){
    const htmlEmployeeArray = employeeArray.map(employee => generateSingleCard(employee));
    return `<div class="ui stackable cards">${htmlEmployeeArray.join(" ")}</div>`
}

function rankTeam(team){
    const teamRanking = team.map(member =>{
        switch(member.role){
            case "Manager":
                member.rank = 100;
                break;
            case "Engineer":
                member.rank = 50;
                break;
            case "Intern":
                member.rank = 10;
                break;
        }
        return member;
    })
    return teamRanking.sort((a,b)=> b.rank-a.rank)
}


async function generateTeamHTML() {
    const employeeArray = rankTeam(await createEmployees());
    const resultCards = generateEmployeeCards(employeeArray);
    const main = await readFileAync("./templates/main.html","utf8");
    const renderedMain = eval("`"+ main +"`");
    const result = await writeFileAync("./output/myTeam.html",renderedMain);
}
generateTeamHTML();