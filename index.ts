import inquirer from 'inquirer';
import chalk from 'chalk';
import readline from 'readline';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

class User {
    name: string;
    id: string;
    password: any;

    constructor(name: string, id: string, password: any) {
        this.name = name;
        this.id = id;
        this.password = password;
    }

    static async SignUp() {
        const answers = await inquirer.prompt([
            {
                name: "userName",
                message: "Enter userName ",
                type: "input",
            },
            {
                name: "userId",
                message: "Enter an Email",
                type: "input",
                validate: function (value) {
                    if (value.trim() === "") {
                        return chalk.red("Please enter a non-empty string");
                    } else {
                        return true;
                    }
                }
            },
            {
                name: "password",
                message: "Enter Password",
                type: "input",
                validate: function (input: any) {
                    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
                    if (passwordRegex.test(input)) {
                        return true;
                    } else {
                        return chalk.blue('Password must contain at least one number and one special character.');
                    }
                }
            }
        ]);
        return new User(answers.userName, answers.userId, answers.password);
    }

    static async Login(saved: User[]) {
        const answers = await inquirer.prompt([
            {
                name: 'userid',
                message: 'Enter Your User Email-ID :',
                type: 'input'
            },
            {
                name: 'password',
                message: 'Enter Your Password :',
                type: 'input',
                mask: '*'
            }
        ]);

        const found = saved.find((user) => user.id === answers.userid && user.password === answers.password);

        if (found) {
            console.log(chalk.green(`Welcome back ${found.name}, Login successful`));
            return found;
        } else {
            console.log(chalk.red('Login failed: Invalid User ID or Password.'));
            return null;
        }
    }

    static async levelFun() {
        const answers = await inquirer.prompt([{
            name: "level",
            message: "What level do you want to select? Easy, Medium, or Difficult",
            type: "list",
            choices: ["Easy", "Medium", "Difficult"]
        }]);

        if (answers.level === "Easy") {
            console.log(chalk.blue.bold("----WELCOME TO EASY LEVEL----"));
            console.log(chalk.green("You selected the easy level. You must write the sentence within a minute."));
            console.log(chalk.blue("Sentence to write: 'Hardworking is the key to success'"));
            let easy="Hardworking is the key to success"
    let EasyAns=await inquirer.prompt([{
    name:"level1",
    message:"Please write the sentence here....",
    type:"input",
}])
    if(EasyAns.level1.length===easy.length)  {
        console.log("your sentence is 100% correct")
       let count=easy.trim().split(" ").length
       console.log(chalk.greenBright( "Your word is ",count))
       console.log(chalk.bold.bgMagenta("\n ------RESULT--------"))
       console.log(chalk.blue(`${this.name} selected the level is easy and \n corrected the sentence word is ${count}`))
    }
    else{
        console.log("your sentence is incorrected")
    }
            
    }}

  
}
(async () => {
    let Exit = false;
    const users: User[] = [];
    while (!Exit) {
        const { action } = await inquirer.prompt([
            {
                name: 'action',
                message: 'Would you like to Signup, Login, or Exit',
                type: 'list',
                choices: ['Signup', 'User Login', 'Exit']
            }
        ]);

        switch (action) {
            case "Signup":
                const newUser = await User.SignUp();
                users.push(newUser);
                console.log(chalk.green("Signup successful"));
                break;
            case "User Login":
                const loggedInUser = await User.Login(users);
                if (loggedInUser) {
                    await User.levelFun();
                }
                break;
            case "Exit":
                Exit = true;
                break;
        }
    }
})();
