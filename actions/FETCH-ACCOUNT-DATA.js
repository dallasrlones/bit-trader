(({ stateMachine, actionMachine, traderMachine, utils }) => {
  const { getState, setState } = stateMachine;
  const { fetchAccountById } = traderMachine;
  const { actionsError } = utils;


  function handleError(err) {
    actionsError('FETCH-ACCOUNT-DATA', err);
  }

  module.exports = (params, done) => {

    try {
      fetchAccountById('OANDA', getState('OANDA-ACCOUNT-PRIMARY-ID'))
        .then((account) => {
          setState('OANDA-ACCOUNT-PRIMARY', account);
          done();
        })
        .catch((err) => {
          handleError(err);
        })
    } catch (err) {
      handleError(err);
    }


  };

})
(
  require('../services')
);