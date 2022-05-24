const fs = require('fs');
const path = require('path');

fs.mkdir('04-copy-directory/files-copy', { recursive: true }, (err) => { // создать папку, если такой еще нет
  if (err) {
    throw err;
  }
});

async function emptyFolder() { 
  fs.readdir('04-copy-directory/files-copy', (err, files) => {
    if (err) throw err; // не прочитать содержимое папки
    
    files.forEach(file => { 
      fs.unlink(`04-copy-directory/files-copy/${file}`, err => {
        if(err) throw err; // не удалось удалить файл
      });
    });
  });
}

async function copyFiles() { 
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
}


(async () => { 
  // await createFolder();
  await emptyFolder();
  await copyFiles();
})();