const path = require('path');
const fs = require('fs');
const { readdir } = require ('fs/promises');

const pathToDir = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

(async () =>  {
  try {
    const filesInDir = await readdir(pathToDir, { withFileTypes: true });
    let files = filesInDir.filter(item => item.isFile())
      .filter(item => path.extname(item.name) === '.css')
      .map(item => item.name);
    
    files.forEach((file) => { 
      const readStream = fs.createReadStream(path.join(pathToDir, file), 'utf-8');
      readStream.on('data', (chunk) => {
        fs.appendFile(
          pathToBundle,
          chunk,
          err => {
            if (err) { throw err; }
          }
        );
      });
    });
  } catch (err) {
    console.error(err);
  }
})();