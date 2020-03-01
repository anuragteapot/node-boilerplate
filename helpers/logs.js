const moment = require('moment');
const fs = require('fs');
const { join } = require('path');

const logs = (text, type = 'log') => {
  const now = moment().format('DD/MM/YYYY HH:mm:ss');
  let string = typeof text === 'object' ? JSON.stringify(text) : text;
  if (process.env.NODE_ENV === 'development') {
    console[type](`[${now}]: ${string}`);
  } else {
    fs.appendFile(
      join(__dirname, '../log.txt'),
      `[${now}]: ${string}\n`,
      function(err) {
        if (err) throw err;
      }
    );
  }
};

module.exports = logs;
