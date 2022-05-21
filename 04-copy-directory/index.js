const fs = require('fs');
const path = require('path');

fs.access('04-copy-directory/files-copy', function(err) {
  if (err && err.code === 'ENOENT') {
    fs.mkdir('04-copy-directory/files-copy', {recursive: true}, (err) => { // создать папку, если такой еще нет
      if (err) { 
        throw err;
      }
    });
    console.log('Папка успешно создана');
  }
});

fs.readdir('04-copy-directory/files', (err, files) => {
  if (err) throw err;
  files.forEach((file) => { 
    let pathFrom = path.join(__dirname, 'files', file);
    let pathTo = path.join(__dirname, 'files-copy', file);
  
    fs.copyFile(pathFrom, pathTo, (err) => { 
      if (err) { 
        throw err;
      }
    });
  });
  console.log('Ура, все файлы скопированы!');
});