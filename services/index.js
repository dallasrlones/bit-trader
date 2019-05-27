((services) => {

  services.stateMachine = require('./stateMachine');
  services.traderMachine = require('./traderMachine');
  services.actionMachine = require('./actionMachine');

})(module.exports, require('colors'));
