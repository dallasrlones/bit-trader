((services) => {

  services.stateMachine = require('./stateMachine');
  services.traderMachine = require('./traderMachine');
  services.actionMachine = require('./actionMachine');
  services.utils = require('./utils');
  services.soundService = require('./soundService');
  services.errorHandlers = require('./errorHandlers');
  services.algoMachine = require('./algoMachine');

  module.exports = services;

})({ });
