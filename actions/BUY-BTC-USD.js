(({ actionMachine, stateMachine, traderMachine, utils }) => {
  const { setState, getState } = stateMachine;
  const { buy } = traderMachine;
  const { actionsError } = utils;

  function handleError(err){
    actionsError('BUY-BTC-USD', err);
  }

  module.exports = (params, done) => {
    const { addToActionQueue } = actionMachine;

    // set a guard so that you don't make a million of the same buys

    try {
      const availableBalance = getState();

      buy('COIN-BASE-BTC', availableBalance)
        .then((orderReciept) => {
          // add to orderReciepts in DB
          done();
        })
        .catch(handleError);

    } catch (err) {
      handleError(err);
    }
  };

})
(
  require('../services')
);
