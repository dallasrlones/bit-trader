((stateMachine, { stateMachineError }, { addToSoundQueueTop }, { friendlyAlert }) => {
  let state = {};
  let prices = {};
  let candles = {};
  let avgs = {};
  let buys = {};
  let profitLosses = {};
  const mostRecentPrices = {};

  stateMachine.setState = (stateName, value) => {
    if (stateName === 'ONLINE' && value === true && state['ONLINE'] === false) {
        addToSoundQueueTop('reconnected.mp3', () => {
          addToSoundQueueTop('updating_to_current.mp3');
        });
        friendlyAlert(' SYSTEM ONLINE - DETECTING MARKET ');

        setTimeout(() => {
          friendlyAlert(' SYSTEM ONLINE - DETECTING MARKET ');
        }, 5000);
        // TO-DO: catch candles up to current time
    }

    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => {
    return state[stateName];
  };

  stateMachine.checkSetGetHighestProfitLoss = (id, newProfitLossValue) => {
    try {
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
    } catch (err) {
      stateMachineError('checkSetGetHighestProfitLoss', err);
    }
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
    try {
      const { closeoutAsk, closeoutBid, instrument, time } = pricingObj;
      const spread = parseFloat((closeoutAsk - closeoutBid) / closeoutAsk * 100).toFixed(3);

      if(mostRecentPrices[instrument] === undefined) {
        mostRecentPrices[instrument] = [pricingObj];
      } else {
        mostRecentPrices[instrument].unshift(pricingObj);

        // 5 seconsd candles (5 * 5)
        if (mostRecentPrices[instrument].length > (5 * 5)) {
          mostRecentPrices[instrument].pop();
        }

        if (mostRecentPrices[instrument].length === (5 * 5) && candles[instrument] !== undefined) {
          const currentPrices = mostRecentPrices[instrument];

          const customCandle = currentPrices.reduce((results, customPriceObj) => {
            const newResults = { ...results };


            if (parseFloat(newResults.bid.h) < parseFloat(customPriceObj.closeoutBid)) {
              newResults.bid.h = customPriceObj.closeoutBid;
            }

            if (parseFloat(newResults.bid.l) > parseFloat(customPriceObj.closeoutBid)) {
              newResults.bid.l = customPriceObj.closeoutBid;
            }

            if (parseFloat(newResults.ask.h) < parseFloat(customPriceObj.closeoutAsk)) {
              newResults.ask.h = customPriceObj.closeoutAsk;
            }

            if (parseFloat(newResults.ask.l) > parseFloat(customPriceObj.closeoutAsk)) {
              newResults.ask.l = customPriceObj.closeoutAsk;
            }

            if (customPriceObj.closeoutBid !== closeoutBid){
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
    } catch (err) {
      stateMachineError('setInstrumentPriceAndSpread', err);
    }
  };

  stateMachine.getInstrumentPrice = name => {
    return prices[name];
  };

  stateMachine.addToInstrumentCandles = (name, newData) => {
    // CHANGE LATER to join
    try {
      candles[name] = newData;
    } catch (err) {
      stateMachineError('addToInstrumentCandles', err);
    }
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
  {},
  require('./errorHandlers'),
  require('./soundService'),
  require('./utils')
);
