(({ actionMachine, stateMachine, traderMachine, errorHandlers, soundService }) => {
  const { getState, setState, checkSetGetHighestProfitLoss, checkBuyExists, addToBuys } = stateMachine;
  const { close } = traderMachine;
  const { actionsError } = errorHandlers;
  const { addToSoundQueue } = soundService;

  function handleError(err) {
    actionsError('CHECK-FOR-PROFIT-LOSS', err);
  }

  module.exports = (params, done) => {
    try {

      /* trades: [
        {
          id: '396',
          instrument: 'EUR_NOK',
          price: '9.78039',
          openTime: '2019-05-31T03:23:30.911276711Z',
          initialUnits: '1',
          initialMarginRequired: '0.0334',
          state: 'OPEN',
          currentUnits: '1',
          realizedPL: '0.0000',
          financing: '0.0000',
          dividend: '0.0000',
          unrealizedPL: '-0.0004',
          marginUsed: '0.0334'
        }
      ], */
      const { trades } = getState('OANDA-ACCOUNT-PRIMARY');

      if (trades.length > 0) {
        trades.forEach((tradeObj) => {
          let { id, instrument, unrealizedPL, marginUsed, openTime, initialUnits, currentUnits, state } = tradeObj;

          if (state === 'OPEN') {

            if (checkBuyExists(instrument) === false) {
              addToSoundQueue('autoDefense.mp3');
              addToBuys(instrument);
            }

            const highestPL = checkSetGetHighestProfitLoss(id, unrealizedPL);
            if (parseFloat(unrealizedPL) <= parseFloat(highestPL * .8)){

              close('OANDA', {
                accountId: getState('OANDA-ACCOUNT-PRIMARY-ID'),
                tradeId: id
              }).then(closeObj => {
                console.log('selling - ' + instrument);
                addToSoundQueue('autoDestruct.mp3');
              }).catch((err) => {
                handleError(err);
                retry();
              });

            }
            // grab highest unrealizedPL for that trade
            // if unrealizedPL <= highestUnrealizedPL * .8 sell
            // if date is less than 5 seconds .5
            // 6 .6
            // 7 .7
            // and stop at 8
            // the older it gets make it .9 but only when unrealizedPL is in the mega bucks

          }

        });
      }
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
