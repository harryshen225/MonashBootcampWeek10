const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Manager = require("./lib/Manager");
const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const  ejs = require('ejs');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

let managerTemplate = "";
let engineerTemplate = "";
let internTemplate = "";

async function readTemplate(){
    const tempManagerTemplate =  readFileAsync("./templates/manager.html","utf8").then(data => managerTemplate=data);
    const tempEngineerTemplate = readFileAsync("./templates/engineer.html","utf8").then(data => engineerTemplate=data);;
    const tempInternTemplate =   readFileAsync("./templates/intern.html","utf8").then(data => internTemplate=data);;
    await Promise.all([tempManagerTemplate,tempEngineerTemplate,tempInternTemplate])
    .then(msg=> console.log("Templates loading completed"))
    .catch(err => console.log(err));

}

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
    console.log(managerTemplate);
    console.log(engineerTemplate);
    console.log(internTemplate);
    switch (employee.getRole()){
        case "Manager":
            return ejs.render(managerTemplate,{employee: employee})
        case "Engineer":
            return  ejs.render(engineerTemplate,{employee: employee})
        case "Intern":
            return  ejs.render(internTemplate,{employee: employee})
    }
}

 function generateEmployeeCards(employeeArray){
    const htmlEmployeeArray = employeeArray.map(employee => generateSingleCard(employee));
    return htmlEmployeeArray.join(" ")
}

function rankTeam(team){
    return team.sort((a,b)=> b.getRank()-a.getRank())
}


async function main() {
    try{
        await readTemplate();
        const employeeArray = rankTeam(await createEmployees());
        const resultCards = generateEmployeeCards(employeeArray);
        const main = await readFileAsync("./templates/main.html","utf8");
        const renderedMain = ejs.render(main,{finalCards: resultCards})
        const result = await writeFileAsync("./output/myTeam.html",renderedMain);
    }
    catch(err){
        console.log(error);
    }
   
}

main();