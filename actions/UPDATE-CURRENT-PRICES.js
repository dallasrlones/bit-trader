(({ stateMachine, traderMachine, errorHandlers, algoMachine }) => {
  const { getState, setInstrumentPriceAndSpread } = stateMachine;
  const { genStats } = algoMachine;
  const { fetchCurrentPricingForInstruments } = traderMachine;
  const { actionsError } = errorHandlers;

  module.exports = (params, done, retry) => {
    function handleError(err) {
      actionsError('UPDATE-CURRENT-PRICES', err);
      retry();
    }

    try {

      // find the most recent candle from candles array
      // start fetching prices and making candles the second the app starts

      // create an array of prices
      // grab the last 5 seconds back and create a candle
      // filter out the ones that are longer than 5 seconds
      let instrumentsArray = (getState('OANDA-AVAILABLE-INSTRUMENTS') || [])
      instrumentsArray = instrumentsArray.map(({ name }) => (name));

      if (instrumentsArray.length < 1) {
        return;
      }

      fetchCurrentPricingForInstruments(
        'OANDA',
        getState('OANDA-ACCOUNT-PRIMARY-ID'),
        instrumentsArray
      )
      .then((pricingArray) => {
        pricingArray.forEach((pricingObj) => {
          setInstrumentPriceAndSpread(pricingObj);
          genStats(pricingObj.instrument);
        });
        done();
      })
      .catch((err) => {
        handleError(err);
      });

    } catch (err) {
      handleError(err);
    }

  };

})
(
  require('../services')
);
