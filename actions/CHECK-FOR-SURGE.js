(({ stateMachine, traderMachine, algoMachine, utils, errorHandlers, soundService }) => {
  const { getState, addToBuys, checkBuyExists } = stateMachine;
  const { buy } = traderMachine;
  const { friendlyAlert } = utils;
  const { playSound, playFloatNumber, playInstrument, playSoundInstant } = soundService;
  const { actionsError } = errorHandlers;
  const { runAlgo } = algoMachine;

  module.exports = (params, done, retry) => {

    function handleError(err) {
      actionsError('CHECK-FOR-SURGE', err);
      retry();
    }

    try {
      // if (getState('MARKET-IS-OPEN') === false) {
      //   return;
      // }

      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');
      availableInstruments.forEach(({ name }) => {

        if (checkBuyExists(name) === false) {
          const { hit, efi } = runAlgo(name);
          if (hit === true) {
            console.log(' I WAS HIT MOTHA LICKA ');
            process.exit(1);
            console.log('BUYING - ' + name);
            playSoundInstant('opentrade.mp3', () => {
              playInstrument(name, () => {
                playSoundInstant('efi_at.mp3', () => {
                  playFloatNumber(efi, ()=> {
                    playSoundInstant('defense_systems.mp3');
                  });
                });
              });

            });
            // addToBuys(name)
            // buy('OANDA', {
            //   accountId: getState('OANDA-ACCOUNT-PRIMARY-ID'),
            //   currencyPair: name,
            //   // MAKE DYNAMIC
            //   amount: 100
            // })
            // .then((order) => {
            //   // remove from buys on close
            //   return done();
            // })
            // .catch((err) => {
            //   handleError(err);
            // });
          }
        }

      });

      done();
    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
  require('colors')
);
