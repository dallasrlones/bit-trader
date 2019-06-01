((stateMachine) => {
  let state = {};
  let prices = {};
  let candles = {};
  let avgs = {};
  let buys = {};
  let profitLosses = {};

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
    const { closeoutAsk, closeoutBid, instrument } = pricingObj;
    const spread = parseFloat((closeoutAsk - closeoutBid) / closeoutAsk * 100).toFixed(3);
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
