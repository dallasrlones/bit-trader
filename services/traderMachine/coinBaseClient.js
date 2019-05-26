((coinBaseClient, { apiKey, apiSecret }, { Client }) => {

  const client = () => {
    return new Client({
      apiKey,
      apiSecret
    });
  };

  coinBaseClient.fetchAccountData = () => {};
  coinBaseClient.fetchAccountBalance = () => {};
  coinBaseClient.fetchCurrentPrice = () => {};
  coinBaseClient.fetchYearsTickData = () => {};
  coinBaseClient.fetchCurrentOrders = () => {};
  coinBaseClient.buy = () => {};
  coinBaseClient.sell = () => {};

})(
  module.exports,
  require('../../config'),
  require('coinbase')
);
