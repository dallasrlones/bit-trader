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
      }, 200)
    });
  };

  coinBaseClient.fetchAccountBalance = () => {

    // const balances = accounts.reduce((results, account) => {
    //   if (account.currency === 'BTC') {
    //     results.btcBalance = account.balance;
    //     results.btcAvailable = account.available;
    //   }
    //
    //   if (account.currency === 'USD') {
    //     results.usdBalance = account.balance;
    //     results.usdAvailable = account.available;
    //   }
    // });
    //
    // resolve(balances);

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          btcBalance: 1,
          btcAvailable: 1,
          usdBalance: 1,
          usdAvailable: 1
        });
      }, 200)
    });
  };

  coinBaseClient.fetchCurrentBuyPrice = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1);
      }, 200)
    });
  };

  coinBaseClient.fetchYearsTickData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Array(60 * 60 * 24 * 366));
      }, 200)
    });
  };

  coinBaseClient.fetchCurrentOrders = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(new Array(2));
      }, 200)
    });
  };

  coinBaseClient.buy = ammount => {
    return new Promise((resolve, reject) => {

      // {
      //   // size is the smallest increment to buy in this case 1 penny
      //   size: '0.01',
      //   price: ammount,
      //   side: 'buy',
      //   product_id: 'BTC-USD'
      // }


      setTimeout(() => {
        resolve('purchase order dater potater');
      }, 200)
    });
  };

  coinBaseClient.sell = ammount => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('sell order dater potater');
      }, 200)
    });
  };

})(
  module.exports,
  require('../../config'),
  {}
);
