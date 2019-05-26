((actions, fs) => {

  const fileNames = fs.readdirSync('./actions');
  fileNames.forEach((fileName) => {
    if (fileName !== 'index.js') {
      const actionName = fileName.slice(0, fileName.length - '.js'.length);
      actions[actionName] = require(`./${fileName}`);
    }
  });

})(
  module.exports,
  require('fs'),
  require('colors')
);
