((traderMachine, coinBaseClient) => {

  traderMachine.fetchCurrentPrice = apiName => {};

  traderMachine.fetchYearsTickData = apiName => {};

  traderMachine.fetchCurrentOrders = apiName => {};

  traderMachine.buy = (apiName, ammount) => {};

  traderMachine.sell = (apiName, ammount) => {};

})
(
  module.exports,
  require('./coinBaseClient')
);
