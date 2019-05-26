((actionMachine, { stateMachine }) => {

  module.exports = (params, done) => {
    done();
  };

})
(
  require('../services/actionMachine'),
  require('../services'),
  require('colors')
);
