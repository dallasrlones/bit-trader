((traderMachine) => {

  const apiBank = {
    'OANDA': require('./oandaClient')
  };

  function checkExistsInAPIBank(apiName) {
    if (apiBank[apiName] === undefined) {
      console.log(` API - ${apiName.toString().blue} - Is not bound `.red);
    }
  }

  traderMachine.fetchAccountData = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchAccountData();
  };

  traderMachine.fetchAccountBalance = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchAccountBalance();
  };

  traderMachine.fetchCurrentBuyPrice = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchCurrentBuyPrice();
  };

  traderMachine.fetchCurrentSellPrice = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchCurrentSellPrice();
  };

  traderMachine.fetchCurrentOrders = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchCurrentOrders();
  };

  traderMachine.fetchYearsTickData = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchYearsTickData();
  };

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
