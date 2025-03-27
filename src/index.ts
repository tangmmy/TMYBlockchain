//starting point of this program
import * as readline from 'readline';

function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const question: string = 'Please enter something (type "exit" to quit): '+'\n 1)Check balance  ';



  function askAgain() {
    rl.question(question, (input: string) => {
      console.log(`You entered: ${input}`);
      
      if (input.toLowerCase() === 'exit') {
        rl.close();
      } else {
        askAgain(); // Ask again if not exiting
      }
    });
  }
  
  askAgain(); // Start the first question
}

main();

