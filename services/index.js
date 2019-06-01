((services, player) => {

  let canPlaySound = true;
  services.playSound = (locationInRoot, cb) => {
    if (canPlaySound) {
      canPlaySound = false;
      player.play('sounds/' + locationInRoot, () => {
        if (cb !== undefined) { cb(); }
      });

      setTimeout(() => { canPlaySound = true; }, 500);
    }
  };

  services.playSoundInstant = (locationInRoot, cb) => {
    player.play('sounds/' + locationInRoot, () => {
      if (cb !== undefined) { cb(); }
    });
  };

  function playNumber(i, name) {
    let time = parseInt(i * 700);
    console.log(time);
    setTimeout(() => {
      player.play(`sounds/${name}.mp3`, () => {});
    }, time);
  }

  services.playFloatNumber = (theNumber) => {
    theNumber = theNumber.toString();
    for (var i = 0; i <= theNumber.length; i++) {
      playNumber(i, theNumber[i]);
    }
  }

  services.playInstrument = (name, cb) => {
    let split = name.split('_');
    services.playSoundInstant(`${split[0]}.mp3`, () => {
      services.playSoundInstant('to.mp3', () => {
        services.playSoundInstant(`${split[1]}.mp3`, () => {});
        if(cb !== undefined) { cb(); };
      });
    })
  };

  services.stateMachine = require('./stateMachine');
  services.traderMachine = require('./traderMachine');
  services.actionMachine = require('./actionMachine');
  services.utils = require('./utils');

  module.exports = services;

})({ }, require('play-sound')(opts = {}));
