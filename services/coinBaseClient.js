((coinBaseClient, { apiKey, apiSecret }, { Client }) => {

  coinBaseClient.client = () => {
    return new Client({
      apiKey,
      apiSecret
    });
  };

})(
  module.exports,
  require('../config'),
  require('coinbase')
);
