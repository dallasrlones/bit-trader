((stateMachine, { stateMachineError }, { addToSoundQueueTop }, { friendlyAlert }) => {
  let state = {};
  let prices = {};
  let candles = {};
  let avgs = {};
  let buys = {};
  let profitLosses = {};
  let mostRecentPrices = {};
  let isntrumentStats = {};
  let turningOnline = false;

  function checkOnline(stateName, value) {
    if (stateName === 'ONLINE' && value === true && state['ONLINE'] === false && turningOnline === false) {
        turningOnline = true;
        friendlyAlert(' SYSTEM ONLINE - DETECTING MARKET ');
        addToSoundQueueTop('reconnected.mp3', () => {
          addToSoundQueueTop('updating_to_current.mp3');
          require('./actionMachine').addToActionQueue('INSTANT', { name: 'UPDATE-CANDLE-DATA' });
          turningOnline = false;
        });
    }
  };

  stateMachine.setState = (stateName, value) => {
    checkOnline(stateName, value);
    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => state[stateName];

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

  stateMachine.clearCustomCandles = () => {
    mostRecentPrices = {};
  };

  stateMachine.getLatestCustomCandleOpenTime = (name) => {
    if (mostRecentPrices[name] === undefined) {
      return false;
    }
    return mostRecentPrices[name][mostRecentPrices[name].length - 1].time || false;
  };

  stateMachine.setInstrumentPriceAndSpread = (pricingObj) => {
    try {
      const { closeoutAsk, closeoutBid, instrument, time } = pricingObj;
      const spread = parseFloat((closeoutAsk - closeoutBid) / closeoutAsk * 100).toFixed(3);

      if(mostRecentPrices[instrument] === undefined) {
        mostRecentPrices[instrument] = [pricingObj];
      } else {
        mostRecentPrices[instrument].unshift(pricingObj);

        const fullCandleLength = 5 * 5;
        // 5 second candles (5 fetch loops in 1 second * 5)
        const lastCandlesCloseBid = mostRecentPrices[instrument].closeoutBid;

        if (mostRecentPrices[instrument].length === fullCandleLength && candles[instrument] !== undefined) {
          const currentPrices = mostRecentPrices[instrument];

          const customCandle = Array.from(new Set(currentPrices)).reduce((results, currentPriceObj) => {
            const newResults = { ...results };

            if (parseFloat(newResults.bid.h) < parseFloat(currentPriceObj.closeoutBid)) {
              newResults.bid.h = currentPriceObj.closeoutBid;
            }

            if (parseFloat(newResults.bid.l) > parseFloat(currentPriceObj.closeoutBid)) {
              newResults.bid.l = currentPriceObj.closeoutBid;
            }

            if (parseFloat(newResults.ask.h) < parseFloat(currentPriceObj.closeoutAsk)) {
              newResults.ask.h = currentPriceObj.closeoutAsk;
            }

            if (parseFloat(newResults.ask.l) > parseFloat(currentPriceObj.closeoutAsk)) {
              newResults.ask.l = currentPriceObj.closeoutAsk;
            }

            if (currentPriceObj.closeoutBid !== closeoutBid){
              newResults.volume += 1;
            }

            return results = newResults;
          },
          {
            time,
            volume: currentPrices[fullCandleLength -1].closeoutBid === lastCandlesCloseBid ? 0 : 1,
            bid: { o: currentPrices[fullCandleLength -1].closeoutBid, h: currentPrices[fullCandleLength -1].closeoutBid, l: currentPrices[fullCandleLength -1].closeoutBid, c: currentPrices[0].closeoutBid },
            ask: { o: currentPrices[fullCandleLength -1].closeoutAsk, h: currentPrices[fullCandleLength -1].closeoutAsk, l: currentPrices[fullCandleLength -1].closeoutAsk, c: currentPrices[0].closeoutAsk }
          });



          candles[instrument].unshift(customCandle);
          candles[instrument].pop();
          mostRecentPrices[instrument] = [];
        }
      }

      prices[instrument] = { ...pricingObj, spread };
    } catch (err) {
      stateMachineError('setInstrumentPriceAndSpread', err);
    }
  };

  stateMachine.getCurrentInstrumentPrice = name => prices[name];

  stateMachine.getCurrentInstrumentPriceList = name => mostRecentPrices[name].sort((a,b) => (a.time > b.time));

  stateMachine.addToInstrumentCandles = (name, newData) => {
    // CHANGE LATER to join for larger sets
    try {
      candles[name] = newData;
    } catch (err) {
      stateMachineError('addToInstrumentCandles', err);
    }
  };

  stateMachine.getCurrentInstrumentCandles = name => candles[name];

  stateMachine.setInstrumentAvgs = (name, avgsObj) => {
    avgs[name] = avgsObj;
  };

  stateMachine.getInstrumentAvgs = name => avgs[name];

  stateMachine.setStats = (name, statsObj) => instrumentStats[name] = statsObj;

  stateMachine.addToStats = (name, statsObj) => {
    if (instrumentStats[name] === undefined) {
      instrumentStats[name] = [];
    }

    instrumentStats[name].unshift(statsObj);
    if (instrumentStats[name].length > (5 * 5)) {
      instrumentStats.pop();
    }
  };

  stateMachine.getCurrentStatsObj = name => isntrumentStats[name];

  module.exports = stateMachine;
})
(
  {},
  require('./errorHandlers'),
  require('./soundService'),
  require('./utils')
);
