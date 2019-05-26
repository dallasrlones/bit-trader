((traderMachine) => {

  const apiBank = {
    'COIN-BASE': require('./coinBaseClient')
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

  traderMachine.fetchCurrentPrice = apiName => {
    checkExistsInAPIBank(apiName);
    return apiBank[apiName].fetchCurrentPrice();
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
