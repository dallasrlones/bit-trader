((services) => {

  services.stateMachine = require('./stateMachine');
  services.coinBaseClient = require('./coinBaseClient');

})(module.exports, require('colors'));
