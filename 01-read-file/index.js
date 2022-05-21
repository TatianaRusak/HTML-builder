const fs = require('fs');
const path = require('path');

let pathOfTextFile = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(pathOfTextFile, 'utf-8');

readStream.on('data', (chunk) => console.log(chunk));
// readStream.on('error', error => console.log('Error', error.message));


