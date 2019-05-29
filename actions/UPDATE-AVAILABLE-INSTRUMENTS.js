(() => {

  function handleError(err) {
    actionsError('UPDATE-AVAILABLE-INSTRUMENTS', err);
  }

  module.exports = (params, done, retry) => {
    try {

      // fetch available instruments
      // add to state
      done();
    } catch (err) {
      handleError(err);
      retry();
    }
  };

})
(
  require('../services')
);
