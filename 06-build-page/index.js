
const path = require('path');
const fs = require('fs');
const { readdir } = require('fs/promises');

// -------- создаем папку   project-dist ---------------

async function makeDir(path) { 
  fs.access(path, function (err) {
    if (err && err.code === 'ENOENT') {
      fs.mkdir(path, {recursive: true}, (err) => { // создать папку, если такой еще нет
        if (err) {
          throw err;
        }
      });
    }
  });
}

const pathToProject = path.join(__dirname, 'project-dist');


// -------- копируем  assets в  project-dist ---------------


const pathToAssetsFromDir = path.join(__dirname, 'assets');
const pathToAssetsToDir = path.join(__dirname, 'project-dist', 'assets');

async function copyDir(pathToOrigDir, pathToCopyDir) { 

  let files = await readdir(pathToOrigDir, { withFileTypes: true });

  files.forEach((file) => {
    let pathFrom = path.join(pathToOrigDir, file.name);

    fs.stat(pathFrom, (err, stats) => {
      if (err) throw err;

      let pathTo = path.join(__dirname, 'project-dist', 'assets', file.name);

      if (stats.isFile()) {
        fs.mkdir(pathToCopyDir, { recursive: true }, err => { 
          if (err) {
            throw err;
          }
        });
        fs.copyFile(pathFrom, path.join(pathToCopyDir, file.name), (err) => {
          if (err) {
            throw err;
          }
        });
      } else {
        makeDir(pathTo); //Create dir in case not found  
        copyDir(pathFrom, pathTo);
      }
    });
  });
}


// -------- создание файла style.css  ---------------

const pathToDir = path.join(__dirname, 'styles');
const pathToBundle = path.join(__dirname, 'project-dist', 'style.css');

async function createCssBundel() {
  try {
    const filesInDir = await readdir(pathToDir, { withFileTypes: true });
    let files = filesInDir.filter(item => item.isFile())
      .filter(item => path.extname(item.name) === '.css')
      .map(item => item.name);
    
    fs.access(pathToBundle, (err) => {
      if (err) {
        return
      }
      fs.truncate(pathToBundle, err => {
        if(err) throw err; // не удалось очистить файл
      });
    });
    
    files.forEach((file) => {
      const readStream = fs.createReadStream(path.join(pathToDir, file), 'utf-8');
      readStream.on('data', (chunk) => {
        fs.appendFile(
          pathToBundle,
          `${chunk}\n`,
          err => {
            if (err) { throw err; }
          }
        );
      });
    });
  } catch (err) {
    console.error(err);
  }
}


// --------------- собираем html ---------

const pathToTemplate = path.join(__dirname, 'template.html');
const pathToComponents = path.join(__dirname, 'components');


async function createHTMLbundel() { 
  fs.readFile(pathToTemplate, 'utf8', (error, templateData) => {
    if (error) throw error; // ошибка чтения файла, если есть

    (async () => { 
      const components = await readdir(pathToComponents, { withFileTypes: true });
      components.forEach(componentItem => { 
        let extansion = path.extname(componentItem.name);
        let componentName = path.basename(componentItem.name, extansion);
        // let componentName = componentItem.name.substring(0, componentItem.name.indexOf('.'));

        let stream = fs.createReadStream(path.join(pathToComponents, `${componentName}.html`));
        let componentData = '';
        stream.on('data', chunk => componentData += chunk);
        stream.on('end', () => {
          templateData = templateData.replace(`{{${componentName}}}`, componentData);
          let htmlFile = fs.createWriteStream(path.join(pathToProject, 'index.html'));
          htmlFile.write(templateData);
        });
      });
    })();
  });
}


(async () => {
  await makeDir(pathToProject);
  await copyDir(pathToAssetsFromDir, pathToAssetsToDir);
  await createHTMLbundel();
  await createCssBundel();
})();