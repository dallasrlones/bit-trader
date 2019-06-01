(({ stateMachine, actionMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchAccountById } = traderMachine;
  const { actionsError } = utils;


  function handleError(err) {
    actionsError('UPDATE-ACCOUNT-DATA', err);
  }

  module.exports = (params, done, retry) => {

    try {
      fetchAccountById('OANDA', getState('OANDA-ACCOUNT-PRIMARY-ID'))
        .then((account) => {
          setState('OANDA-ACCOUNT-PRIMARY', account);
          done();
        })
        .catch((err) => {
          handleError(err);
          retry();
        })
    } catch (err) {
      handleError(err);
      retry();
    }
  };

})
(
  require('../services')
);
