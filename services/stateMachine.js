((stateMachine) => {
  let state = {};
  let prices = {};
  let candles = {};
  let avgs = {};

  stateMachine.setState = (stateName, value) => {
    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => {
    return state[stateName];
  };

  stateMachine.setInstrumentPrice = (name, pricingObj) => {
    prices[name] = pricingObj;
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

  stateMachine.getInstrumentCandles = name => {
    return candles[name];
  };

  stateMachine.setInstrumentAvgs = (name, avgsObj) => {
    avgs[name] = avgsObj;
  };

  stateMachine.getInstrumentAvgs = name => {
    return avgs[name];
  };
})
(
  module.exports
);
