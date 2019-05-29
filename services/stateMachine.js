((stateMachine) => {
  let state = {};

  stateMachine.setState = (stateName, value) => {
    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => {
    return state[stateName];
  };

  stateMachine.addToInstrumentCandles = (name, newData) => {
    console.log('name', name);
    console.log('newData', newData);
    process.exit(1)
    if (state[`${name}-DATA-SET`] === undefined) {
      state[`${name}-DATA-SET`] = newData;
      return;
    }

    state[`${name}-DATA-SET`] = state[`${name}-DATA-SET`].join(newData);
  };

  stateMachine.getInstrumentCandles = name => {
    return state[`${name}-DATA-SET`];
  };

  stateMachine.setInstrumentAvgs = (name, avgsObj) => {
    state[`${name}-AVGS`] = avgsObj;
  };

  stateMachine.getInstrumentAvgs = () => {
    return state[`${name}-AVGS`];
  };
})
(
  module.exports
);
