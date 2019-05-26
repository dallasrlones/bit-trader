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
  coinBaseClient.fetchYearsTickData = () => {};
  coinBaseClient.fetchCurrentOrders = () => {};
  coinBaseClient.buy = ammount => {};
  coinBaseClient.sell = ammount => {};

})(
  module.exports,
  require('../../config'),
  require('coinbase')
);
