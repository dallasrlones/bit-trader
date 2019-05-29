(({ stateMachine, traderMachine, utils }) => {
  const { getState, setInstrumentPrice } = stateMachine;
  const { fetchCurrentPricingForInstruments } = traderMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('UPDATE-CURRENT-PRICES', err);
  }

  module.exports = (params, done, retry) => {

    try {

      const instrumentsArray = getState('OANDA-AVAILABLE-INSTRUMENTS').map(({ name }) => (name));
      fetchCurrentPricingForInstruments(
        'OANDA',
        getState('OANDA-ACCOUNT-PRIMARY-ID'),
        instrumentsArray
      )
        .then((pricingArray) => {
          pricingArray.forEach((pricingObj) => setInstrumentPrice(pricingObj));
          done();
        })
        .catch((err) => {
          handleError(err);
          retry();
        });

    } catch (err) {
      handleError(err);
      retry();
    }

  };

})
(
  require('../services')
);
