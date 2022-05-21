const path = require('path');
const fs = require('fs');

const pathToDir = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

const files = fs.readdirSync(pathToDir, { withFileTypes: true })
  .filter(item => item.isFile())
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