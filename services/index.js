((services, player) => {

  services.playSound = locationInRoot => {
    player.play('sounds/' + locationInRoot, () => {});
  };

  services.stateMachine = require('./stateMachine');
  services.traderMachine = require('./traderMachine');
  services.actionMachine = require('./actionMachine');
  services.utils = require('./utils');

})(module.exports, require('play-sound')(opts = {}));
