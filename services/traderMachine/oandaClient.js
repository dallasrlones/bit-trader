((oandaClient, axios, { baseOandaUrl }) => {

  const client = axios.create({
    baseURL: baseOandaUrl,
    timeout: 2000,
    headers: {}
  });

  function handleError(methodName, err) {
    console.log(`${'oandaClient'.yellow} - ${methodName.toString().green} - ${err.toString().red}`);
    console.log(err);
  }

  oandaClient.fetchAccount = () => {
    return client.get(`/`);
  };

  oandaClient.fetchBalance = () => {
    return client.get(`/`);
  };

  oandaClient.fetchCurrentBuyPrice = () => {
    return client.get(`/`);
  };

  oandaClient.fetchCurrentSellPrice = () => {
    return client.get(`/`);
  };

  oandaClient.fetchCurrentOrders = () => {
    return client.get(`/`);
  };

  oandaClient.fetchTickDataFrom = (currencyPair, fromDate) => {
    return client.get(`/instruments/${currencyPair}/candles?from=${fromDate}`);
  };

  oandaClient.fetchYearsTickData = (currencyPair) => {
    const secondsInAYear = (60 * 60 * 24 * 366);
    const rightNow = Date.now();

    let itterationsNeeded = secondsInAYear / 5000;
    const fullDataSet = [];

    return new Promise(( resolve, reject ) => {
      let count = Number(itterationsNeeded);

      for (var i = 0; i <= itterationsNeeded; i++) {
        oandaClient.fetchTickDataFrom(currencyPair, new Date(rightNow).setSeconds((i + 1) * 5000))
          .then(({ data }) => {
            fullDataSet.concat(data.candles);
            count -= 1;

            if (count === 0) {
              resolve(fullDataSet);
            }
          }).catch((err) => {
            handleError('fetchYearsTickData', err);
          });
      }

    });
  };

  oandaClient.buy = ammount => {
    return client.post(`/`);
  };

  oandaClient.sell = ammount => {
    return client.post(`/`);
  };

})
(
  module.exports,
  require('axios'),
  require('../../config'),
  require('colors')
);
