((utils) => {

  utils.friendlyAlert = message => {
    console.log(message.toString().bgWhite.blue);
  };

  utils.actionsError = (actionName, err) => {
    console.log(`${'actions'.green}/${actionName}.js - ${err.toString().red}`);
    console.log(err);
  }

  utils.getAverage = arr => arr.reduce( ( p, c ) => parseFloat(p) + parseFloat(c), 0 ) / arr.length;

  utils.getPercentageChanged = (oldNumber, newNumber) => {
    var decreaseValue = oldNumber - newNumber;
    return (decreaseValue / oldNumber) * 100;
  };

  utils.generateInstrumentAvgs = candlesArray => {
    try {
      const avgArray = [];

      for (var i in candlesArray) {
        // let newAvgObj = {
        //   complete: true,
        //   volume: 3,
        //   time: '2019-05-29T05:16:05.000000000Z',
        //   bid: { o: '16.41438', h: '16.41488', l: '16.41438', c: '16.41488' },
        //   mid: { o: '16.42153', h: '16.42200', l: '16.42153', c: '16.42200' },
        //   ask: { o: '16.42868', h: '16.42912', l: '16.42868', c: '16.42912' }
        // };

        // TO-DO: Bid and Ask prices tell you the spread, only go after spreads that aren't crazy

        const { volume, time, bid, mid, ask } = candlesArray[i];
        if (i > 0) {
          const newAvgObj = {
            volume,
            time,
            percentageChanged: utils.getPercentageChanged(candlesArray[i - 1].ask.l, candlesArray[i].ask.l)
          };
          avgArray.push(newAvgObj);
        }
      };

      return avgArray.sort((a,b) => {
        return new Date(a.time).getTime() > new Date(b.time).getTime();
      });
    } catch (err) {
      console.log('UTILS - generateInstrumentAvgs');
      console.log(err);
    }
  };

  utils.getCandlePercentageChanged = (oldCandle, newCandle) => {
    return {
      c: utils.getPercentageChanged(oldCandle.c, newCandle.c),
      h: utils.getPercentageChanged(oldCandle.h, newCandle.h),
      l: utils.getPercentageChanged(oldCandle.l, newCandle.l),
      o: utils.getPercentageChanged(oldCandle.o, newCandle.o)
    };
  };

  utils.generateVelocitiesArrayFromCandles = (candlesArray, limit) => {
    let velocitiesArray = [];

    for (var i in candlesArray) {
      if (i !== 0) {
        velocitiesArray.push(
          utils.getCandlePercentageChanged(candles[i - 1], candles[i])
        );
      }
    }

    return velocitiesArray;
  };

  utils.algo = avgsArray => {
    // avgsArray is [ {
    //   volume,
    //   time,
    //   percentageChanged
    // } ]
    const lastTickPercentageChange = utils.getPercentageChanged(avgsArray[0].percentageChanged, avgsArray[1].percentageChanged);
    if (lastTickPercentageChange <= -20000) {
      return true;
    }

    return false;
  };

})(module.exports, require('colors'));
