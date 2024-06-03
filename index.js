import inquirer from 'inquirer';
import chalk from 'chalk';
import readline from 'readline';
import { promisify } from 'util';
const sleep = promisify(setTimeout);
class User {
    name;
    id;
    password;
    constructor(name, id, password) {
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
                    }
                    else {
                        return true;
                    }
                }
            },
            {
                name: "password",
                message: "Enter Password",
                type: "input",
                validate: function (input) {
                    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])/;
                    if (passwordRegex.test(input)) {
                        return true;
                    }
                    else {
                        return chalk.blue('Password must contain at least one number and one special character.');
                    }
                }
            }
        ]);
        return new User(answers.userName, answers.userId, answers.password);
    }
    static async Login(saved) {
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
        }
        else {
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
            const userInput = await this.getUserInputWithinTime(60000); // 60 seconds
            if (userInput) {
                console.log(`You wrote: ${userInput}`);
                const correctSentence = "Hardworking is the key to success";
                if (userInput.trim() === correctSentence) {
                    console.log(chalk.green("Your sentence is 100% correct"));
                    const wordCount = correctSentence.split(' ').length;
                    console.log(chalk.green(`Your word count is ${wordCount}`));
                    console.log(chalk.green(`${this.name} selected the easy level and wrote the correct sentence with ${wordCount} words.`));
                }
                else {
                    const userWords = userInput.split(' ');
                    const correctWords = correctSentence.split(' ');
                    let correctCount = 0;
                    userWords.forEach((word, index) => {
                        if (word === correctWords[index]) {
                            correctCount++;
                        }
                    });
                    const accuracy = (correctCount / correctWords.length) * 100;
                    console.log(chalk.yellow(`You wrote ${userWords.length} words.`));
                    console.log(chalk.yellow(`Your accuracy is ${accuracy.toFixed(2)}%.`));
                    console.log(chalk.red("The sentence is incorrect."));
                }
            }
            else {
                console.log(chalk.red("Oops, you are very lazy, you didn't complete the task in time."));
            }
        }
    }
    static async getUserInputWithinTime(timeLimit) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        let userInput = '';
        const inputPromise = new Promise((resolve) => {
            rl.question('', (answer) => {
                userInput = answer;
                rl.close();
                resolve(userInput);
            });
        });
        const timeoutPromise = sleep(timeLimit).then(() => null);
        const result = await Promise.race([inputPromise, timeoutPromise]);
        if (!result) {
            rl.close();
        }
        return result;
    }
}
(async () => {
    let Exit = false;
    const users = [];
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
