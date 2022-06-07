const fs = require('fs');
const helperFunctions = require('../LaunchGame/helperFunctions');

const loadStorageFile = (type) => {
  let a = fs.readFileSync(`./Game/${type}.json`, { encoding: 'utf8' });
  return JSON.parse(a);
};
module.exports = {
  loadStorageFile,
};
