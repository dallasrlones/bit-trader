((services) => {

  services.stateMachine = require('./stateMachine');
  services.traderMachine = require('./traderMachine');

})(module.exports, require('colors'));
