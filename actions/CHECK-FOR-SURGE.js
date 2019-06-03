(({ stateMachine, traderMachine, utils, errorHandlers, soundService }) => {
  const { getState, getInstrumentAvgs, addToBuys, checkBuyExists } = stateMachine;
  const { buy } = traderMachine;
  const { algo, friendlyAlert } = utils;
  const { playSound, playFloatNumber, playInstrument, playSoundInstant } = soundService;
  const { actionsError } = errorHandlers;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {

    try {
      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');

      availableInstruments.forEach(({ name }) => {

        const avgsArray = getInstrumentAvgs(name);

        if (avgsArray.length && avgsArray.length > 0) {
          const { algoMatch, efi } = algo(avgsArray);
          if (algoMatch === true) {

            if (getState('MARKET-IS-OPEN')) {
              // set buy starting
              if (checkBuyExists(name) === false) {
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
                addToBuys(name)
                buy('OANDA', {
                  accountId: getState('OANDA-ACCOUNT-PRIMARY-ID'),
                  currencyPair: name,
                  amount: 100
                })
                  .then((order) => {
                    // remove from buys on close
                    return done();
                  })
                  .catch((err) => {
                    handleError(err);
                    retry();
                  });
              }
            } else {
              // friendlyAlert(`Tried to buy - ${name} but market is closed.`);
              // playSound('tried_to_buy.mp3', () => {
              //   playInstrument(name, () => {
              //     playSoundInstant('but_the.mp3', () => {
              //       playSoundInstant('market_closed.mp3');
              //     })
              //   })
              // });
            }
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
