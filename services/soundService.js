((soundService, player) => {

  let canPlaySound = true;

  soundService.playSound = (locationInRoot, cb, intervalToWait) => {
    if (canPlaySound) {
      canPlaySound = false;
      player.play('sounds/' + locationInRoot, () => {
        if (cb !== undefined) { cb(); }
      });

      setTimeout(() => { canPlaySound = true; }, intervalToWait || 500);
    }
  };

  soundService.playSoundInstant = (locationInRoot, cb) => {
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

  soundService.playFloat = (theNumber) => {
    theNumber = theNumber.toString();
    for (var i = 0; i <= theNumber.length; i++) {
      playNumber(i, theNumber[i]);
    }
  }

  soundService.playInstrument = (name, cb) => {
    let split = name.split('_');
    services.playSoundInstant(`${split[0]}.mp3`, () => {
      services.playSoundInstant('to.mp3', () => {
        services.playSoundInstant(`${split[1]}.mp3`, () => {});
        if(cb !== undefined) { cb(); };
      });
    })
  };

  soundService.playInQueue = () => {};

  module.exports = soundService;

})
(
  {},
  require('play-sound')(opts = {})
);
