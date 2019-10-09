((algoMachine, {
  getState,
  setState,
  addToStats,
  getCurrentInstrumentPriceList,
  getCurrentInstrumentCandles,
  getCurrentInstrumentPrice,
  getCurrentStatsObj
}, { algoMachineError }) => {

  function getDifference(num1, num2) {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    return parseFloat((num1 > num2) ? num1 - num2 : num2 - num1);
  }

  algoMachine.genStats = instrumentName => {
    // generate stats on each price update
    try {
      const currentPricingList = Array.from(new Set(getCurrentInstrumentPriceList(instrumentName)));
      const currentCandlesList = getCurrentInstrumentCandles(instrumentName);

      if (currentPricingList.length < (5 * 5) - 1) {
        return;
      }

      const actualCurrentPriceObj = currentPricingList[0];
      const actualCurrentCandleObj = currentCandlesList[0];

      const statsObj = {
        efi: false,
        // ticks / candles: [3, 2, 0]) First candle is positive at 3 pip changes,
        // 2nd candle positive at 2 pip change
        // zero means it did not change in bid price yet is put into the positve array with 0 pip change
        timesPositiveFromCurrent: { ticks: [], candles: [] },
        // timesNegativeFromCurrent: { ticks: [], candles: [] },
        // grabs the velocities from current tick until end of ticks || candles
        vels: { ticks: [], candles: [] },
        // grabs the avgs from current tick until end of ticks || candles
        priceAvgs: { ticks: [], candles: [] },
        // grabs the pip change avgs from current tick until end of ticks || candles
        pipAvgs: { ticks: [], candles: [] }
      };

      // loop through ticks [0-24]
      for (var i = 0; i < currentPricingList.length; i++) {
        if (i + 1 != currentPricingList.length) {

          const closeoutBid = parseFloat(currentPricingList[i].closeoutBid);
          const prevCloseoutBid = parseFloat(currentPricingList[i + 1].closeoutBid);

          console.log(getCurrentInstrumentPriceList(instrumentName));
          console.log(closeoutBid);
          console.log(prevCloseoutBid);
          process.exit(1338)

          // statsObj.timesPositiveFromCurrent.ticks
          if (parseFloat(currentPricingList[i].closeoutBid) >= parseFloat(currentPricingList[i + 1].closeoutBid)) {
            statsObj.timesPositiveFromCurrent.ticks.push(
              getDifference(currentPricingList[i].closeoutBid, currentPricingList[i + 1].closeoutBid)
            );
            console.log(statsObj.timesPositiveFromCurrent.ticks);
          }

          // statsObj.vels.ticks
          statsObj.vels.ticks.push(
            getDifference(
              currentPricingList[0].closeoutBid,
              currentPricingList[i + 1].closeoutBid
            )
          );

          // statsObj.priceAvgs.ticks
          statsObj.priceAvgs.ticks.push(
            parseFloat(currentPricingList.slice(0, i + 1).reduce((a, b) => {
              return parseFloat(a.closeoutBid) + parseFloat(b.closeoutBid)
            }, 0) / (i + 1))
          );

          // statsObj.pipAvgs.ticks
          statsObj.pipAvgs.ticks.push(
            parseFloat(
              currentPricingList.slice(0, i + 1).reduce((a, b) => {
                return getDifference(parseFloat(a.closeoutBid), parseFloat(b.closeoutBid))
              }, 0) / (i + 1)
            )
          );

        }
      }

      console.log(currentPricingList.length);
      console.log(statsObj);
      process.exit(1337)

      // loop through candles [0 - 180]
      for (var i = 0; i <= currentCandlesList.length; i++) {

      }


      addToStats(instrumentName, statsObj);
    } catch (err) {
      algoMachineError('genStats', err);
    }
  };

  algoMachine.runAlgo = instrumentName => {
    const { spread, closeoutBid } = getCurrentInstrumentPrice(instrumentName);
    const statsObj = getCurrentStatsObj(instrumentName);

    if (statsObj === undefined) {
      return { hit: false };
    }

    const {
      efi,
      timesPositiveFromCurrent,
      timesNegativeFromCurrent,
      vels,
      priceAvgs,
      pipAvgs
    } = statsObj;

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
      currentPriceIsLessThanOrEqualToLastXTickPriceAvgsTimesY(5, 2) &&
      ticksWerePositiveTheLastXTicks(3) &&
      currentSpreadIsLessThanX(2)
    );

    return { hit: theQuestion, efi };
  };

  module.exports = algoMachine;
})
(
  { },
  require('./stateMachine'),
  require('./errorHandlers')
);
