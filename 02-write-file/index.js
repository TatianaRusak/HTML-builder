const { stdout } = require('process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

let pathForYournotes = path.join(__dirname, 'yournotes.txt');

fs.writeFile(
  pathForYournotes,
  '',
  err => {
    if (err) {
      throw err.message;
    }
  }
);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Что мне надо записать?\n'
});

rl.prompt();

rl.on('line', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }

  fs.appendFile(
    pathForYournotes,
    `${data}\n`,
    err => {
      if (err) { throw err; }
      stdout.write('Записал. Что-то еще?\n');
    }
  );
});



// -------- ВАРИАНТ 2 -------------

// fs.writeFile(
//   pathForYournotes,
//   '',
//   err => {
//     if (err) {
//       throw err.message;
//       // }
//       // else {
//       //   stdout.write('Что мне записать в файл?\n');
//       // }
//     }
//   }
// );
// stdin.on('data', data => {
//   if (data.toString().trim() === 'exit') {
//     process.exit();
//   };

//   fs.appendFile(
//     pathForYournotes,
//     data,
//     err => {
//       if (err) { throw err; }
//       stdout.write('Записал. Что-то еще?\n');
//     }
//   );
// });

process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => stdout.write('Ну что ж... прощай!'));
