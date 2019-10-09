(({ stateMachine, traderMachine, algoMachine, utils, errorHandlers, soundService }) => {
  const { getState, addToBuys, checkBuyExists } = stateMachine;
  const { buy } = traderMachine;
  const { friendlyAlert } = utils;
  const { playSound, playFloatNumber, playInstrument, playSoundInstant } = soundService;
  const { actionsError } = errorHandlers;
  const { runAlgo } = algoMachine;

  function handleError(err) {
    actionsError('SELL-ALL-INSTRUMENTS', err);
  }

  module.exports = (params, done) => {

    try {

    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services'),
  require('colors')
);
