((coinBaseClient, { apiKey_CoinBase, apiSecret_CoinBase }, { Client }) => {

  const client = () => {
    return new Client({
      apiKey: apiKey_CoinBase,
      apiSecret: apiSecret_CoinBase
    });
  };

  coinBaseClient.fetchAccountData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('account dater potater');
      }, 2000)
    });
  };

  coinBaseClient.fetchAccountBalance = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('account balance dater potater');
      }, 2000)
    });
  };

  coinBaseClient.fetchCurrentPrice = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('current price dater potater');
      }, 2000)
    });
  };

  coinBaseClient.fetchYearsTickData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Array(60 * 60 * 24 * 366));
      }, 2000)
    });
  };

  coinBaseClient.fetchCurrentOrders = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Array(2));
      }, 2000)
    });
  };

  coinBaseClient.buy = ammount => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('purchase order dater potater');
      }, 2000)
    });
  };

  coinBaseClient.sell = ammount => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('sell order dater potater');
      }, 2000)
    });
  };

})(
  module.exports,
  require('../../config'),
  require('coinbase')
);
