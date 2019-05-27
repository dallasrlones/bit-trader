((coinBaseClient, { apiKey_CoinBase, apiSecret_CoinBase }, { Client }) => {

  const client = () => {
    return new Client({
      apiKey: apiKey_CoinBase,
      apiSecret: apiSecret_CoinBase
    });
  };

  coinBaseClient.fetchAccountData = () => {};
  coinBaseClient.fetchAccountBalance = () => {};
  coinBaseClient.fetchCurrentPrice = () => {};
  coinBaseClient.fetchYearsTickData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Array(60 * 60 * 24 * 366));
      }, 2000)
    });
  };
  coinBaseClient.fetchCurrentOrders = () => {};
  coinBaseClient.buy = ammount => {};
  coinBaseClient.sell = ammount => {};

})(
  module.exports,
  require('../../config'),
  require('coinbase')
);
