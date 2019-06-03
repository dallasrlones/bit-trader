((oandaClient, axios, { baseOandaUrl, oandaAuthHeader }, { playSound }) => {
  const alignmentTimezone = 'America/Denver';
  const client = axios.create({
    baseURL: `${baseOandaUrl}/v3`,
    timeout: 1000 * 5,
    headers: {
      'Authorization': oandaAuthHeader,
      'Content-Type': 'application/json',
      // 'alignmentTimezone': alignmentTimezone,
      'Accept-Datetime-Format': 'UNIX'
    }
  });
  const granularity = 'S5';


  function handleError(methodName, err, reject) {
    console.log(`${'oandaClient'.yellow} - ${methodName.toString().green} - ${err.toString().red}`);
    if (
      err.toString() === 'Error: read ECONNRESET' ||
      err.toString() === 'Error: timeout of 5000ms exceeded'
    ) {
      console.log(' INTERNET SHIT THE BED ');
      playSound('connection_unstable.mp3', undefined, 1500);
      return reject('');
    } else if (err.toString() === 'Error: getaddrinfo ENOTFOUND api-fxpractice.oanda.com') {
      setTimeout(() => {
        playSound('cant_find_source.mp3', undefined, 2500);
      }, 1000);
      return reject('');
    } else {
      console.log(err);
    }
    reject(err);
  }

  oandaClient.fetchAccountIds = () => {
    return new Promise((resolve, reject) => {
      client.get('/accounts')
        .then(({ data }) => {
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
          const { account } = data;
          resolve(account);
        })
        .catch((err) => {
          handleError('fetchAccount', err, reject);
        });
    });
    // accounts also hold positions / balance
    // positions contain current trades including profit loss and fees charged
  };

  // gets the instruments you can legally trade with
  oandaClient.fetchAvailableInstruments = accountId => {
    return new Promise((resolve, reject) => {
      client.get(`/accounts/${accountId}/instruments`)
        .then(({ data }) => {
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
        .then(({ data }) => {
          const { prices } = data;
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
          // FIX LATER
          //from,
          count,
        }
      })
      .then(({ data }) => {
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
  require('../soundService'),
  require('colors')
);
