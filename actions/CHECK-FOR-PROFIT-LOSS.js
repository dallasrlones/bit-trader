(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { getState, setState, getBuys } = stateMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('CHECK-FOR-PROFIT-LOSS', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;
    try {

      // trades: [
      //   {
      //     id: '396',
      //     instrument: 'EUR_NOK',
      //     price: '9.78039',
      //     openTime: '2019-05-31T03:23:30.911276711Z',
      //     initialUnits: '1',
      //     initialMarginRequired: '0.0334',
      //     state: 'OPEN',
      //     currentUnits: '1',
      //     realizedPL: '0.0000',
      //     financing: '0.0000',
      //     dividend: '0.0000',
      //     unrealizedPL: '-0.0004',
      //     marginUsed: '0.0334'
      //   }
      // ],
      const { trades } = getState('OANDA-ACCOUNT-PRIMARY');

      trades.forEach(({ id, instrument, unrealizedPL, marginUsed, openTime, initialUnits, currentUnits, state }) => {

        if (state === 'OPEN') {

          // grab highest unrealizedPL for that trade
          // if unrealizedPL <= highestUnrealizedPL * .8 sell
            // if date is less than 5 seconds .5
            // 6 .6
            // 7 .7
            // and stop at 8
            // the older it gets make it .9 but only when unrealizedPL is in the mega bucks

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
