// const fs = require('fs');
const path = require('path');
const { readdir } = require ('fs/promises');
const fs = require ('fs');

let pathToFiles = path.join(__dirname, 'secret-folder');

(async function copyDir() {
  try {
    const files = await readdir(pathToFiles, { withFileTypes: true });
    for (const dirent of files) { 
      
      let expansion = path.extname(dirent.name);
      let name = path.basename(dirent.name, expansion);
      fs.stat(path.join(pathToFiles, dirent.name), (err, stats) => { 
        if (err) { throw err.message };
        let size = `${stats.size}b`;

        if (dirent.isFile(dirent)) { 
          console.log(`${name} - ${expansion.slice(1)} - ${size}`)
        }
      });
    }
  } catch (err) {
    console.error(err);
  }
})();