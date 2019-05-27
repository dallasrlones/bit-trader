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

  // traderMachine.fetchAccountBalance = (apiName, accountId) => {
  //   checkExistsInAPIBank(apiName);
  //   return apiBank[apiName].fetchAccountBalance(accountId);
  // };

  traderMachine.fetchCurrentPricingForInstruments = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchCurrentPricingForInstruments();
  };

  // traderMachine.fetchCurrentOrders = (apiName, accountId) => {
  //   checkExistsInAPIBank(apiName);
  //   return apiBank[apiName].fetchCurrentOrders(accountId);
  // };

  traderMachine.fetchTickDataFrom = (apiName, fromDate) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchTickDataFrom(fromDate);
  };

  // traderMachine.fetchYearsTickData = apiName => {
  //   checkExistsInAPIBank(apiName);
  //   return apiBank[apiName].fetchYearsTickData();
  // };

  traderMachine.buy = (apiName, ammount) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].buy(ammount);
  };

  traderMachine.sell = (apiName, ammount) => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].sell(ammount);
  };

})
(
  module.exports,
  require('colors')
);
