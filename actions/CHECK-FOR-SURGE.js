(({ actionMachine, stateMachine, traderMachine, utils }, player) => {
  const { getState, getInstrumentAvgs, addToBuys, checkBuyExists } = stateMachine;
  const { buy } = traderMachine;
  const { actionsError, algo } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-SURGE', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    try {
      const availableInstruments = getState('OANDA-AVAILABLE-INSTRUMENTS');

      availableInstruments.forEach(({ name }) => {

        const avgsArray = getInstrumentAvgs(name);

        if (avgsArray.length && avgsArray.length > 0) {
          if (algo(avgsArray) === true) {
            // set buy starting
            if (checkBuyExists(name) === false) {
              console.log('BUYING - ' + name);
              player.play('buyBeep.mp3', () => {});
              addToBuys(name)
              buy('OANDA', {
                accountId: getState('OANDA-ACCOUNT-PRIMARY-ID'),
                currencyPair: name,
                amount: 10
              })
                .then((order) => {
                  // remove from buys on close
                  done();
                })
                .catch((err) => {
                  handleError(err);
                  retry();
                });
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
  require('play-sound')(opts = {}),
  require('colors')
);
