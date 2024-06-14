#! usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import banner from "node-banner";

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
                message:  chalk.blue("Enter userName : "),
                type: "input",
            },
            {
                name: "userId",
                message:chalk.blue( "Enter an Email : "),
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
                message: chalk.blue("Enter Password : "),
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
                message: chalk.blue('Enter Your User Email-ID :'),
                type: 'input'
            },
            {
                name: 'password',
                message: chalk.blue('Enter Your Password :'),
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
            message: chalk.hex('#FF00FF').bold('What level do you want to select? Easy, Medium, or Difficult'),
            type: "list",
            choices: ["Easy", "Medium", "Difficult"]
        }]);
    
        let sentence = '';
        let levelName = '';
        let timeLimit = 0;
    
        switch (answers.level) {
            case "Easy":
                levelName = 'EASY';
                sentence = "Hardworking is the key to success";
                timeLimit = 120000; // 2 minutes
                break;
            case "Medium":
                levelName = 'MEDIUM';
                sentence = "Consistent effort over time is what leads to outstanding results";
                timeLimit = 90000; // 1.5 minutes
                break;
            case "Difficult":
                levelName = 'DIFFICULT';
                sentence = "To achieve greatness, one must embrace challenges and persist through adversity";
                timeLimit = 60000; // 1 minute
                break;
        }
    
        console.log(chalk.blue.bold(`----WELCOME TO ${levelName} LEVEL----\n`));
        console.log(chalk.green(`You selected the ${chalk.bold.gray(levelName)} level. You have ${chalk.bold.gray(timeLimit / 1000)} seconds to write the sentence.\n`));
        console.log(chalk.blue(`Sentence to write: '${sentence}'\n`));
    
        const startTime = new Date();
    
        const levelAns = await inquirer.prompt([{
            name: "level1",
            message: "Please write the sentence here....",
            type: "input"
        }]);
    
        const endTime = new Date();
        const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000; //in seconds 
    
        if (timeTaken > timeLimit / 1000) {
            console.log(chalk.red('Time limit exceeded!'));
        }
    
        // Calculate Words Per Minute (WPM)
        const wordsTyped = levelAns.level1.trim().split(/\s+/).length;
        const minutes = timeTaken / 60; //convert into minutes
        const wpm = Math.round(wordsTyped / minutes);
    
        if (levelAns.level1.length === sentence.length && levelAns.level1.trim() === sentence) {
            console.log("Your sentence is 100% correct\n");
            console.log(chalk.greenBright(`Your word count is ${wordsTyped}`));
            console.log(chalk.greenBright(`Your typing speed is approximately ${wpm} words per minute (WPM).\n`));
            console.log(chalk.bold.green("\n\t ------RESULT--------\n\t "));
            console.log(chalk.blue(`You selected the ${chalk.bold.gray(levelName)} level and corrected the sentence. Word count is ${chalk.bold.gray(wordsTyped)}`));
        } else {
            console.log("Your sentence is incorrect");
        }
        
        console.log(chalk.yellow(`Time taken: ${timeTaken.toFixed(2)} seconds `));
        console.log(chalk.yellow(`Time given: ${timeLimit / 1000} seconds`));
    }
    
}

(async () => {
    // Displaying banner
    await banner('Typing Testing Speed', 'project 2');

    let Exit = false;
    const users: User[] = [];
    let loggedInUser: User | null = null;

    while (!Exit) {
        if (!loggedInUser) {
            const { action } = await inquirer.prompt([
                {
                    name: 'action',
                    message: chalk.hex('#FF00FF')('Would you like to Signup, Login, or Exit'),
                    type: 'list',
                    choices: ['Signup', 'User Login', 'Exit']
                }
            ]);

            switch (action) {
                case "Signup":
                    const newUser = await User.SignUp();
                    users.push(newUser);
                    console.log(chalk.green("---------Signup successful---------"));
                    break;
                case "User Login":
                    loggedInUser = await User.Login(users);
                    console.log(chalk.green("--------login successful-------"));
                    if (loggedInUser) {
                        await User.levelFun();
                    }
                    break;
                case "Exit":
                    Exit = true;
                    break;
            }
        } else {
            await User.levelFun();
            const { continueAction } = await inquirer.prompt([
                {
                    name: 'continueAction',
                    message: chalk.hex('#FF00FF')('Would you like to continue or logout?'),
                    type: 'list',
                    choices: ['Continue', 'Logout']
                }
            ]);

            if (continueAction === 'Logout') {
                loggedInUser = null;
            }
        }
    }
})();

