(({ stateMachine, traderMachine, errorHandlers }) => {
  const { getState, setState } = stateMachine;
  const { fetchAccountIds } = traderMachine;
  const { actionsError } = errorHandlers;

  function handleError(err) {
    actionsError('FETCH-ACCOUNT-ID', err);
  }

  module.exports = (params, done, retry) => {
    try {
      fetchAccountIds('OANDA')
        .then((accounts) => {
          accounts.forEach(({ id }) => {
            // CHECK TO SEE IF 001 IS YOUR PRIMARY ACCOUNT
            if (id.slice((id.length - 3), id.length) === '001') {
              setState('OANDA-ACCOUNT-PRIMARY-ID', id);
            }

          });

          done();
        })
        .catch(err => {
          handleError(err);
          retry();
        });
    } catch (err) {
      handleError(err);
      done();
    }


  };

})
(
  require('../services')
);
