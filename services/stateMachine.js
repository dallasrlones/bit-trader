((stateMachine) => {
  let state = {};

  stateMachine.setState = (stateName, value) => {
    state[stateName] = value;
  };

  stateMachine.getState = (stateName) => {
    return state[stateName];
  };
})
(
  module.exports
);
