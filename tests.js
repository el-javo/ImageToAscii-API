const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const fs = require('fs')


let imgstats = fs.statSync('./py/out/canvas.jpg')
const original = imgstats.size
console.log(`original : ${imgstats.size}`)

var options = {
  dry: false,       // dryrun test  
  quiet: false,     // force quiet run
  recursive: false, // Run recursively
  verbose: false    // Run verbosely
};


var job = pulverizr.compress('./py/out/canvas.jpg', options);
imgstats = fs.statSync('./py/out/canvas.jpg')
console.log(`pulv : ${imgstats.size}, ${imgstats.size/original}`)
