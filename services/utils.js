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

  utils.getVelocity = (oldValue, newValue) => {
    let velocity = parseFloat(0.0);
    oldValue = parseFloat(oldValue);
    newValue = parseFloat(newValue);
    if (parseFloat(newValue) > parseFloat(oldValue)) {
      velocity = 100 / parseFloat(newValue - oldValue);
    } else {
      velocity = 100 / parseFloat(oldValue - newValue);
    }

    return velocity;
  };

  utils.generateInstrumentAvgs = candlesArray => {
    try {
      const avgArray = [];

      candlesArray.sort((a,b) => {
        return new Date(a.time).getTime() > new Date(b.time).getTime();
      });

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

        // const { volume, time, bid, mid, ask } = currentCandle;
        if ( i > 0 ) {
          const lastCandle = candlesArray[i];
          const currentCandle = candlesArray[i - 1];
          const newAvgObj = {
            volume: currentCandle.volume,
            time: new Date(currentCandle.time).getTime(),
            bidLowVelocity: utils.getVelocity(lastCandle.bid.l, currentCandle.bid.l),
            bidHighVelocity: utils.getVelocity(lastCandle.bid.h, currentCandle.bid.h),
            midLowVelocity: utils.getVelocity(lastCandle.mid.l, currentCandle.mid.l),
            midHighVelocity: utils.getVelocity(lastCandle.mid.h, currentCandle.mid.h),
            askLowVelocity: utils.getVelocity(lastCandle.ask.l, currentCandle.ask.l),
            askHighVelocity: utils.getVelocity(lastCandle.ask.h, currentCandle.ask.h),
            spread: (parseFloat(currentCandle.ask.c) - parseFloat(currentCandle.bid.c)),
            positive: (parseFloat(currentCandle.ask.h) > parseFloat(currentCandle.ask.l))
          };
          avgArray.push(newAvgObj);
        }
      };

      return avgArray.sort((a,b) => {
        return new Date(a.time).getTime() > (new Date(b.time).getTime());
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
    //   askLowVelocity,
    //   askHighVelocity,
    //   midLowVelocity,
    //   midHighVelocity,
    //   bidLowVelocity,
    //   bidHighVelocity,
    // } ]

    const currentPriceObj = {};

    function currentAskIsGraterThanLastByXTimes(x) {
      return avgsArray[0].bidLowVelocity > (avgsArray[1].askHighVelocity * x);
    }

    function currentSpreadIsLow() {
      return avgsArray[0].spread <= parseFloat(0.002);
    }

    function lastTwoWerePositive() {
      return (avgsArray[0].positive && avgsArray[1].positive)
    }

    function lastTwoVolumesAreHigherThanTwo() {
      return (parseInt(avgsArray[0].volume) > 3 && parseInt(avgsArray[1].volume) > 2);
    }

    // GRAB AVGS AS WELL AS VELOCITY
    // AVGS CHECK AVG PIP CHANGE TO GET A BASELINE

    function allAlgos() {
      return (
        currentAskIsGraterThanLastByXTimes(20) &&
        currentSpreadIsLow() &&
        lastTwoWerePositive() &&
        lastTwoVolumesAreHigherThanTwo()
      );
    }

    if (allAlgos()) {
      return true;
    }

    return false;
  };

})(module.exports, require('colors'));
