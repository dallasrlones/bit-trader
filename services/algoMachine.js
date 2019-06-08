((algoMachine, {
  getState,
  setState,
  addToStats,
  getCurrentInstrumentPriceList,
  getCurrentInstrumentCandles,
  getCurrentInstrumentPrice,
  getCurrentStatsObj
}, { algoMachineError }) => {

  algoMachine.genStats = (instrumentName) => {
    // generate stats on each price update
    const currentPricingList = Array.from(new Set(getCurrentInstrumentPriceList(instrumentName)));
    const actualTickPrice = currentPricingList[0];
    const actualBidPrice = actualTickPrice.closeoutBid;

    const currentCandlesList = getCurrentInstrumentCandles(instrumentName);

    const statsObj = {
      efi: false,
      // (candles: [3, 2, 0]) First candle is positive at 3 pip changes, 2nd candle positive at 2 pip change
      // zero means it did not change in bid price yet is put into the positve array with 0 pip change
      timesPositiveFromCurrent: { ticks: [], candles: [] },
      timesNegativeFromCurrent: { ticks: [], candles: [] },
      // grabs the velocities from current tick until end of ticks || candles
      vels: { ticks: [], candles: [] },
      // grabs the avgs from current tick until end of ticks || candles
      priceAvgs: { ticks: [], candles: [] },
      // grabs the pip change avgs from current tick until end of ticks || candles
      pipAvgs: { ticks: [], candles: [] }
    };
    const currentTickPricesSum = 0;
    const currentCandlePricesSum = 0;


    for (var i = 1; i <= currentPricingList.length; i++) {
      const pricingObj = currentPricingList[parseInt(i) - 1];
      const currentCloseBid = pricingObj.clouseoutBid;

      const lastPricingObj = currentPricingList[i];
      const previousCloseBid = lastPricingObj.closeoutBid;

      const currentPricingListSliceToI = currentPricingList.slice(0, parseInt(i));

      // if the current bid price is greater than or equal to the one before current bid price
      if (currentCloseBid >= previousCloseBid) {
        statsObj.timesPositiveFromCurrent.ticks.push(parseFloat(currentCloseBid - previousCloseBid));
      } else {
      // if the current bid price is less than the one before current bid price
        statsObj.timesNegativeFromCurrent.ticks.push(parseFloat(previousCloseBid - currentCloseBid));
      }

      // if the current tick price close bid is greater or equal to the last price close bid
      statsObj.vels.ticks.push(parseFloat(actualBidPrice - previousCloseBid));

      statsObj.priceAvgs.ticks.push(
        parseFloat(
          currentPricingListSliceToI.reduce((results, { closeoutBid }) => {
            results = parseFloat(results + parseFloat(closeoutBid));
            return results;
          }) / parseInt(i)
        )
      );

      statsObj.pipAvgs.ticks.push(
        parseFloat(
          currentPricingListSliceToI.reduce((results, { closeoutBid }, pipIndex) => {
            if (pipIndex !== currentPricingListSliceToI.length - 1) {
              results = parseFloat(results + parseFloat(closeoutBid - currentPricingListSliceToI[parseInt(pipIndex) + 1]));
            }
            return results;
          }) / parseInt(i)
        )
      );
    }

    for (var i = 0; i <= currentCandlesList.length; i++) {
      const candleObj = currentCandlesList[i];


    }




    addToStats(instrumentName, statsObj);
  };

  algoMachine.runAlgo = instrumentName => {
    const { spread, closeoutBid } = getCurrentInstrumentPrice(instrumentName);
    const {
      efi,
      timesPositiveFromCurrent,
      timesNegativeFromCurrent,
      vels,
      priceAvgs,
      pipAvgs
    } = getCurrentStatsObj(instrumentName);

  // currentCustomCandleIsAboveAverageBidLowVelocityByX
  // currentCustomCandleIsAboveAverageBidMidVelocityByX
  // currentCustomCandleIsAboveAverageBidHighVelocityByX
  // currentCustomCandleIsAboveAverageAskLowVelocityByX
  // currentCustomCandleIsAboveAverageAskMidVelocityByX
  // currentCustomCandleIsAboveAverageAskHighVelocityByX
  // currentCustomCandleBidIsAboveAverageAskHighVelocityByX
  // currentCustomCandleBidLowIsGraterThanLastAskHighByXTimes
  // currentCustomCandleSpreadIsLowerThanX
  // lastXVelocityCandlesWerePositive
  // lastXVelocityCandleVolumesAreHigherThanLimit
  // spreadIsLowerThanAskLowVelocityTimesX
  // eldersForceIndexOverXAmount

    const currentSpreadIsLessThanX = x => (currentSpread <= parseFloat(x));

    const currentPriceIsLessThanOrEqualToLastXTickPriceAvgsTimesY = (x, y) => (currentPrice >= parseFloat(priceAvgs.ticks[x] * y));

    const ticksWerePositiveTheLastXTicks = x => (timesPositiveFromCurrent.ticks.length >= x);


    const theQuestion = (
      currentPriceIsLessThanOrEqualToLastXTickPriceAvgsTimesY(5, 4) &&
      ticksWerePositiveTheLastXTicks(5) &&
      currentSpreadIsLessThanX(2)
    );

    return theQuestion;
  };

  module.exports = algoMachine;
})
(
  { },
  require('./stateMachine'),
  require('./errorHandlers')
);
