((stateMachine) => {
  let state = {};

  stateMachine.setState = (stateName, value) => {
    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => {
    return state[stateName];
  };

  stateMachine.addToInstrumentCandles = (name, newData) => {
    // CHANGE LATER
    if (!newData.length || newData.length === 0) {
      console.log(name);
      console.log(newData);
      process.exit(1);
    }
    state[`${name}-DATA-SET`] = newData;
  };

  stateMachine.getInstrumentCandles = name => {
    return state[`${name}-DATA-SET`];
  };

  stateMachine.setInstrumentAvgs = (name, avgsObj) => {
    state[`${name}-AVGS`] = avgsObj;
  };

  stateMachine.getInstrumentAvgs = name => {
    return state[`${name}-AVGS`];
  };
})
(
  module.exports
);
