(({ stateMachine, traderMachine, utils }) => {
  const { getState, setInstrumentPrice } = stateMachine;
  const { fetchCurrentPricingForInstruments } = traderMachine;
  const { actionsError } = utils;

  function handleError(err) {
    actionsError('UPDATE-CURRENT-PRICES', err);
  }

  module.exports = (params, done, retry) => {

    try {

      // find the most recent candle from candles array
      // start fetching prices and making candles the second the app starts

      // create an array of prices
      // grab the last 5 seconds back and create a candle
      // filter out the ones that are longer than 5 seconds

      const instrumentsArray = getState('OANDA-AVAILABLE-INSTRUMENTS').map(({ name }) => (name));
      fetchCurrentPricingForInstruments(
        'OANDA',
        getState('OANDA-ACCOUNT-PRIMARY-ID'),
        instrumentsArray
      )
        .then((pricingArray) => {
          pricingArray.forEach((pricingObj) => setInstrumentPrice(pricingObj.instrument, pricingObj));
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
