((oandaClient, axios, { baseOandaUrl, oandaAuthHeader }, { setState }, { ajaxError }) => {
  const alignmentTimezone = 'America/Denver';
  const client = axios.create({
    baseURL: `${baseOandaUrl}/v3`,
    timeout: 1000 * 15,
    headers: {
      'Authorization': oandaAuthHeader,
      'Content-Type': 'application/json',
      'Accept-Datetime-Format': 'UNIX'
    }
  });
  const granularity = 'S5';

  let linkEstablished = true;

  function handleError(methodName, err, reject) {
    ajaxError(methodName, err, reject);
  }

  oandaClient.fetchAccountIds = () => {
    return new Promise((resolve, reject) => {
      client.get('/accounts')
        .then(({ data }) => {
          setState('ONLINE', true);
          const { accounts } = data;
          resolve(accounts);
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
          setState('ONLINE', true);
          const { account } = data;
          resolve(account);
        })
        .catch((err) => {
          handleError('fetchAccount', err, reject);
        });
    });
  };

  // gets the instruments you can legally trade with
  oandaClient.fetchAvailableInstruments = accountId => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${accountId}/instruments`)
        .then(({ data }) => {
          setState('ONLINE', true);
          const { instruments } = data;
          resolve(instruments);
        })
        .catch((err) => {
          handleError('fetchAvailableInstruments', err, reject);
        });
    });
  };

  oandaClient.fetchCurrentPricingForInstruments = (accountId, instrumentsArray) => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${accountId}/pricing`, {
        params: { instruments: instrumentsArray.join(',')
      } })
        .then(({ data: { prices } }) => {
          setState('ONLINE', true);
          resolve(prices);
        })
        .catch((err) => {
          handleError('fetchCurrentPricingForInstruments', err, reject);
        });
    });
  };

  // use the accounts method for current trades open
  oandaClient.fetchCurrentOrders = accountId => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${accountId}/orders`)
        .then(({ data }) => {
          setState('ONLINE', true);
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
          price: 'BA',
          granularity,
          // FIX
          to: from,
          //from,
          //to: new Date(new Date(from * 1000).getTime() - 200 - (1000 * 60 * 15) / 1000).getTime().toFixed(0)
          count,
        }
      })
      .then(({ data }) => {
        setState('ONLINE', true);
        const { candles } = data;
        resolve(candles);
      })
      .catch((err) => {
        handleError('fetchTickDataFrom', err, reject);
      });
    });
  };

  // CHECK TO SEE IF WORKS
  oandaClient.buy = ({ accountId, currencyPair, amount }) => {
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
          setState('ONLINE', true);
          resolve(data);
        })
        .catch((err) => {
          handleError('buy', err, reject);
        });
    });
  };

  // FINISH
  oandaClient.close = ({ accountId, tradeId }) => {
    return new Promise((resolve, reject) => {
      client.put(`/accounts/${accountId}/trades/${tradeId}/close`)
        .then(({ data }) => {
          setState('ONLINE', true);
          resolve(data);
        })
        .catch((err) => {
          handleError('close', err, reject);
        });
    });
  };

})
(
  module.exports,
  require('axios'),
  require('../../config'),
  require('../stateMachine'),
  require('../errorHandlers'),
  require('colors')
);
