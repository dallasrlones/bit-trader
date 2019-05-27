((oandaClient, axios) => {

  const oandaAPI_URL = '';

  oandaClient.fetchAccount = () => {
    return axios.get(`${oandaAPI_URL}/`);
  };

  oandaClient.fetchBalance = () => {
    return axios.get(`${oandaAPI_URL}/`);
  };

  oandaClient.fetchCurrentBuyPrice = () => {
    return axios.get(`${oandaAPI_URL}/`);
  };

  oandaClient.fetchCurrentSellPrice = () => {
    return axios.get(`${oandaAPI_URL}/`);
  };

  oandaClient.fetchCurrentOrders = () => {
    return axios.get(`${oandaAPI_URL}/`);
  };

  oandaClient.fetchYearsTickData = () => {
    return axios.get(`${oandaAPI_URL}/`);
  };

  oandaClient.buy = ammount => {
    return axios.post(`${oandaAPI_URL}/`);
  };

  oandaClient.sell = ammount => {
    return axios.post(`${oandaAPI_URL}/`);
  };

})
(
  module.exports,
  require('axios'),
);
