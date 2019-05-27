((oandaClient, axios, { baseOandaUrl, oandaAuthHeader }) => {

  const client = axios.create({
    baseURL: `${baseOandaUrl}/v3`,
    timeout: 2000,
    headers: {
      'Authorization': oandaAuthHeader,
      'Content-Type': 'application/json'
    }
  });

  const granularity = 'S1';
  const alignmentTimezone = 'America/Denver';

  function handleError(methodName, err, reject) {
    console.log(`${'oandaClient'.yellow} - ${methodName.toString().green} - ${err.toString().red}`);
    console.log(err);
    reject(err);
  }

  oandaClient.fetchAccountIds = () => {
    return new Promise((resolve, reject) => {
      client.get('/accounts')
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          handleError('fetchAccountIDs', err, reject);
        });
    });
  };

  oandaClient.fetchAccountById = accountId => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${accountId}`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          handleError('fetchAccount', err, reject);
        });
    });
    // accounts also hold positions / balance
    // positions contain current trades including profit loss and fees charged
  };

  oandaClient.fetchCurrentPricingForInstruments = (accountId, instrumentsArray) => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${oandaAccountId}/pricing`, { params: { instruments: instrumentsArray.join('%2') } })
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          handleError('fetchCurrentPricingForInstruments', err, reject);
        });
    });
  };

  // use the accounts method for current positions open
  oandaClient.fetchCurrentOrders = accountId => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${accountId}/orders`)
        .then(({ data }) => {
          resolve({ orders: data.orders });
        })
        .catch((err) => {
          handleError('fetchCurrentOrders', err, reject);
        });
    });
  };

  oandaClient.fetchTickDataFrom = (currencyPair, from, count) => {
    return new Promise((resolve, reject) => {
      client.get(`/instruments/${currencyPair}/candles`, {
        params: {
          price: 'MBA',
          granularity,
          alignmentTimezone,
          from,
          count
        }
      })
      .then(({ data }) => {
        resolve(data);
      })
      .catch((err) => {
        handleError('fetchTickDataFrom', err, reject);
      });
    });
  };

  oandaClient.fetchMonthsTickData = (currencyPair, fromDate) => {
    const secondsInAMonth = (60 * 60 * 24 * 28);
    return oandaClient.fetchTickDataFrom(currencyPair, fromDate.setSeconds(`-${secondsInAMonth}`), secondsInAMonth);
  };

  oandaClient.buy = ({ accountId, currencyPair, ammount }) => {
    const newOrder = {
      order: {
        units: amount,
        instrument: currencyPair,
        timeInForce: 'FOK',
        type: 'MARKET',
        positionFill: 'DEFAULT'
      }
    };

    return new Promise((resolve, reject) => {
      client.post(`/accounts/${accountId}/orders`, newOrder)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          handleError('buy', err, reject);
        });
    });
  };

  oandaClient.sell = ({ accountId, currencyPair, ammount }) => {
    return new Promise((resolve, reject) => {
      client.post(`/accounts/${accountId}/orders`)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          handleError('sell', err, reject);
        });
    });
  };

})
(
  module.exports,
  require('axios'),
  require('../../config'),
  require('colors')
);
