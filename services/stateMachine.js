((stateMachine) => {
  let state = {};
  let prices = {};
  let candles = {};
  let avgs = {};
  let buys = {};
  let profitLosses = {};
  const mostRecentPrices = {};

  stateMachine.setState = (stateName, value) => {
    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => {
    return state[stateName];
  };

  stateMachine.checkSetGetHighestProfitLoss = (id, newProfitLossValue) => {
    const currentHigh = profitLosses[id];
    newProfitLossValue = parseFloat(newProfitLossValue);
    if (currentHigh !== undefined) {
      if (parseFloat(currentHigh) < newProfitLossValue) {
        profitLosses[id] = newProfitLossValue;
      }
    } else {
      profitLosses[id] = newProfitLossValue;
    }
    return profitLosses[id];
  };

  stateMachine.addToBuys = (instrumentName) => {
    buys[instrumentName] = true;
  };

  stateMachine.checkBuyExists = (instrumentName) => {
    const exists = buys[instrumentName] || false;
    return exists;
  };

  stateMachine.removeFromBuys = (instrumentName) => {
    delete buys[instrumentName];
  };

  stateMachine.setInstrumentPriceAndSpread = (pricingObj) => {
    const { closeoutAsk, closeoutBid, instrument, time } = pricingObj;
    const spread = parseFloat((closeoutAsk - closeoutBid) / closeoutAsk * 100).toFixed(3);

    if(mostRecentPrices[instrument] === undefined) {
      mostRecentPrices[instrument] = [];
      mostRecentPrices[instrument].unshift(pricingObj);
    } else {
      mostRecentPrices[instrument].unshift(pricingObj);

      // 5 seconsd candles (5 * 5)
      if (mostRecentPrices[instrument].length > (5 * 5)) {
        console.log(mostRecentPrices[instrument]);
        console.log('REMOVING CANDLE');
        process.exit(1)
        mostRecentPrices[instrument].pop();
      }

      if (mostRecentPrices[instrument].length === (5 * 5) && candles[instrument] !== undefined) {
        const currentPrices = mostRecentPrices[instrument];

        console.log('HIT');
        console.log(currentPrices);
        process.exit(1)

        const customCandle = currentPrices.reduce((results, customPriceObj) => {
          const newResults = { ...results };
          if (parseFloat(newResults.bid.h) < parseFloat(customPriceObj.closeoutBid)) {
            console.log('hit 1');
            newResults.bid.h = customPriceObj.bid.h;
          }

          if (parseFloat(newResults.bid.l) > parseFloat(customPriceObj.closeoutBid)) {
            console.log('hit 2');
            newResults.bid.l = customPriceObj.closeoutBid;
          }

          if (parseFloat(newResults.ask.h) < parseFloat(customPriceObj.closeoutAsk)) {
            console.log('hit 3');
            newResults.ask.h = customPriceObj.ask.h;
          }

          if (parseFloat(newResults.ask.l) > parseFloat(customPriceObj.closeoutAsk)) {
            console.log('hit 4');
            newResults.ask.l = customPriceObj.ask.l;
          }

          if (customPriceObj.closeoutBid !== closeoutBid){
            console.log('hit 5');
            newResults.volume += 1;
          }

          return results = newResults;
        },
        {
          time,
          volume: 0,
          bid: { o: currentPrices[4].closeoutBid, h: currentPrices[4].closeoutBid, l: currentPrices[4].closeoutBid, c: currentPrices[0].closeoutBid },
          ask: { o: currentPrices[4].closeoutAsk, h: currentPrices[4].closeoutAsk, l: currentPrices[4].closeoutAsk, c: currentPrices[0].closeoutAsk }
        });

        candles[instrument].unshift(customCandle);
        candles[instrument].pop();
      }
    }

    prices[instrument] = { ...pricingObj, spread };
  };

  stateMachine.getInstrumentPrice = name => {
    return prices[name];
  };

  stateMachine.addToInstrumentCandles = (name, newData) => {
    // CHANGE LATER
    if (!newData.length || newData.length === 0) {
      console.log(name);
      console.log(newData);
      process.exit(1);
    }
    candles[name] = newData;
  };

  // custom current candles

  stateMachine.addToCustomCandles = priceObj => {
    // unshift
    // pop
  };

  // candles initial load

  stateMachine.getInstrumentCandles = name => {
    return candles[name];
  };

  stateMachine.setInstrumentAvgs = (name, avgsObj) => {
    avgs[name] = avgsObj;
  };

  stateMachine.getInstrumentAvgs = name => {
    return avgs[name];
  };

  module.exports = stateMachine;
})
(
  {}
);
