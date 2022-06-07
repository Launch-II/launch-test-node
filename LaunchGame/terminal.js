// THIS FILE WILL EVENTUALLY BE DEPRECATED
console.log('Loading terminal.js');

// Dependencies
const chalk = require('chalk');
const helperFunctions = require('./helperfunctions');

// Chalk Styles. There's got to be a better way to do this, but I'm doing it the Tobster way.

module.exports.log = log = (data, style, extra) => {
  var styledMessage;

  switch (style) {
    default:
      if (!style) return (styledMessage = chalk.white(data));
      styledMessage = chalk.yellow(`Malformed terminal.log! ${data}`);
      break;

    case 'warning':
      styledMessage = chalk.yellow(data);
      break;
    case 'networkEvent':
      styledMessage = chalk.blueBright(data);
      break;
    case 'serverSays':
      styledMessage = chalk.cyanBright(`Server:`, data);
      break;
    case 'tick':
      styledMessage = chalk.greenBright(`Tick: ${data}`);
      break;
    case 'code':
      styledMessage = chalk.magentaBright(data);
      break;
    case 'lifeCycle':
      styledMessage = chalk.bold.yellow(`==== ${data} ====`);
      break;
    case 'error':
      styledMessage = chalk.red(`Error: ${data}`);
      break;
  }
  extra
    ? console.log(
        chalk.blue(`[${helperFunctions.getTime()}] `) + styledMessage,
        extra
      )
    : console.log(
        chalk.blue(`[${helperFunctions.getTime()}] `) + styledMessage
      );
};
