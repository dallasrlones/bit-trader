((soundService, player, { soundServiceError }) => {

  let canPlaySound = true;

  soundService.playSound = (locationInRoot, cb, intervalToWait) => {
    try {
      if (canPlaySound) {
        canPlaySound = false;
        player.play('sounds/' + locationInRoot, () => {
          if (cb !== undefined) { cb(); }
        });

        setTimeout(() => { canPlaySound = true; }, intervalToWait || 500);
      }
    } catch (err) {
      soundServiceError('playSound', err);
    }
  };

  soundService.playSoundInstant = (locationInRoot, cb) => {
    try {
      player.play('sounds/' + locationInRoot, () => {
        if (cb !== undefined) { cb(); }
      });
    } catch (err) {
      soundServiceError('playSoundInstant', err);
    }
  };

  function playNumber(i, name) {
    let time = parseInt(i * 700);
    setTimeout(() => {
      player.play(`sounds/${name}.mp3`, () => {});
    }, time);
  }

  soundService.playFloat = (theNumber) => {
    try {
      theNumber = theNumber.toString();
      for (var i = 0; i <= theNumber.length; i++) {
        playNumber(i, theNumber[i]);
      }
    } catch (err) {
      soundServiceError('playFloat', err);
    }
  }

  soundService.playInstrument = (name, cb) => {
    try {
      let split = name.split('_');
      services.playSoundInstant(`${split[0]}.mp3`, () => {
        services.playSoundInstant('to.mp3', () => {
          services.playSoundInstant(`${split[1]}.mp3`, () => {});
          if(cb !== undefined) { cb(); };
        });
      })
    } catch (err) {
      soundServiceError('playInstrument', err);
    }
  };

  const soundQueue = [];
  let soundQueueIsPlaying = false;

  function play(name, cb) {
    soundQueueIsPlaying = true;
    soundService.playSoundInstant(name, () => {
      soundQueueIsPlaying = false;
      if (cb !== undefined) {
        cb();
      }
    });
  }

  soundService.addToSoundQueue = (fileLocation, cb) => {
    soundQueue.push(cb !== undefined ? [fileLocation, cb] : fileLocation);
  };

  soundService.addToSoundQueueTop = (fileLocation) => {
    soundQueue.unshift(fileLocation);
  };

  soundService.runSoundQueue = () => {
    try {
      if (soundQueue.length > 0 && soundQueueIsPlaying === false) {
        if (Array.isArray(soundQueue[0])) {
          const [name, cb] = soundQueue[0];
          play(name, cb);
        } else {
          play(soundQueue[0]);
        }

        soundQueue.shift();
      }
    } catch (err) {
      soundServiceError('runSoundQueue', err);
    }
  };

  module.exports = soundService;

})
(
  {},
  require('play-sound')(opts = {}),
  require('./errorHandlers')
);
