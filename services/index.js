((services) => {

  services.stateMachine = require('./stateMachine');
  services.traderMachine = require('./traderMachine');
  services.actionMachine = require('./actionMachine');
  services.utils = require('./utils');

})(module.exports, require('colors'));
