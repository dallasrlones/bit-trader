((traderMachine) => {

  const apiBank = {
    'OANDA': require('./oandaClient')
  };

  function checkExistsInAPIBank(apiName) {
    if (apiBank[apiName] === undefined) {
      console.log(` API - ${apiName.toString().blue} - Is not bound `.red);
    }
  }

  traderMachine.fetchAccountIds = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchAccountIds();
  };

  traderMachine.fetchAccountById = (apiName, accountId) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchAccountById(accountId);
  };

  traderMachine.fetchAvailableInstruments = (apiName, accountId) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchAvailableInstruments(accountId);
  };

  // traderMachine.fetchAccountBalance = (apiName, accountId) => {
  //   checkExistsInAPIBank(apiName);
  //   return apiBank[apiName].fetchAccountBalance(accountId);
  // };

  traderMachine.fetchCurrentPricingForInstruments = (apiName, accountId, instrumentsArray) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchCurrentPricingForInstruments(accountId, instrumentsArray);
  };

  // traderMachine.fetchCurrentOrders = (apiName, accountId) => {
  //   checkExistsInAPIBank(apiName);
  //   return apiBank[apiName].fetchCurrentOrders(accountId);
  // };

  traderMachine.fetchTickDataFrom = (apiName, currencyPair, fromDate, count) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchTickDataFrom(currencyPair, fromDate, count);
  };

  // traderMachine.fetchYearsTickData = apiName => {
  //   checkExistsInAPIBank(apiName);
  //   return apiBank[apiName].fetchYearsTickData();
  // };

  traderMachine.buy = (apiName, amount) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].buy(amount);
  };

  traderMachine.sell = (apiName, amount) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].sell(amount);
  };

})
(
  module.exports,
  require('colors')
);
