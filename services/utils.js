((utils) => {

  function handleError(methodName, err){
    console.log(`${'utils'.yellow} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  }

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

  utils.getPipChange = (oldValue, newValue) => {
    let velocity = parseFloat(0.0);
    oldValue = parseFloat(oldValue);
    newValue = parseFloat(newValue);
    if (parseFloat(newValue) > parseFloat(oldValue)) {
      velocity = (1000 * parseFloat(newValue - oldValue)).toFixed(3);
    } else {
      velocity = (1000 * parseFloat(oldValue - newValue)).toFixed(3);
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
        if ( i > 0 ) {
          const lastCandle = candlesArray[i];
          const currentCandle = candlesArray[i - 1];
          const newAvgObj = {
            volume: currentCandle.volume,
            time: new Date(currentCandle.time).getTime(),
            bidLowVelocity: utils.getPipChange(lastCandle.bid.l, currentCandle.bid.l),
            bidHighVelocity: utils.getPipChange(lastCandle.bid.h, currentCandle.bid.h),
            midLowVelocity: utils.getPipChange(lastCandle.mid.l, currentCandle.mid.l),
            midHighVelocity: utils.getPipChange(lastCandle.mid.h, currentCandle.mid.h),
            askLowVelocity: utils.getPipChange(lastCandle.ask.l, currentCandle.ask.l),
            askHighVelocity: utils.getPipChange(lastCandle.ask.h, currentCandle.ask.h),
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

  function generateAverage(list) {
    const theAvg = list.reduce((results, listItem) => {
      return results += parseFloat(listeItem);
    }, 0) / list.length;

    return theAvg;
  }

  utils.generateAveragesFromVelocityArray = velocityArray => {
    try {
      const averagesObj = velocityArray.reduce((results, velocityObj) => {
        const {
          volume
          time,
          bidLowVelocity,
          bidHighVelcity,
          midLowVelocity,
          midHighVelcity,
          askLowVelocity,
          askHighVelcity,
          spread,
          positive,
        } = velocityObj;

        results.volumeList.push(volume);
        results.bidLowVelocityList.push(bidLowVelocity);
        results.bidHighVelcityList.push(bidHighVelcity);
        results.midLowVelocityList.push(midLowVelocity);
        results.midHighVelcityList.push(midHighVelcity);
        results.askLowVelocityList.push(askLowVelocity);
        results.askHighVelcityList.push(askHighVelcity);
        results.spreadList.push(spread);

        return results;

      }, {
        volumeList: [],
        bidLowVelocityList: [],
        bidHighVelocityList: [],
        midLowVelocityList: [],
        midHighVelocityList: [],
        askLowVelocityList: [],
        askHighVelocityList: [],
        spreadList: []
      });


      const averageVelocities = {
        volumeAvgs: generateAverage(averagesObj.volumeAvgs),
        bidLowVelocityAvgs: generateAverage(averagesObj.bidLowVelocityAvgs),
        bidHighVelocityAvgs: generateAverage(averagesObj.bidHighVelocityAvgs),
        midLowVelocityAvgs: generateAverage(averagesObj.midLowVelocityAvgs),
        midHighVelocityAvgs: generateAverage(averagesObj.midHighVelocityAvgs),
        askLowVelocityAvgs: generateAverage(averagesObj.askLowVelocityAvgs),
        askHighVelocityAvgs: generateAverage(averagesObj.askHighVelocityAvgs),
        spreadAvgs: generateAverage(averagesObj.spreadAvgs)
      };

      return averageVelocities;
    } catch (err) {
      handleError('generateAveragesFromVelocityArray', err);
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

  utils.algo = velocityArray => {
    // velocityArray is [ {
    //   volume,
    //   time,
    //   askLowVelocity,
    //   askHighVelocity,
    //   midLowVelocity,
    //   midHighVelocity,
    //   bidLowVelocity,
    //   bidHighVelocity,
    // } ]

    const avgsObj = generateAveragesFromVelocityArray(velocityArray);
    const {
      volumeAvgs,
      bidLowVelocityAvgs,
      bidHighVelocityAvgs,
      midLowVelocityAvgs,
      midHighVelocityAvgs,
      askLowVelocityAvgs,
      askHighVelocityAvgs,
      spreadAvgs
    } = avgsObj;

    const currentPriceObj = {};

    function currentAskIsGraterThanLastByXTimes(x) {
      return velocityArray[0].bidLowVelocity > (velocityArray[1].askHighVelocity * x);
    }

    function currentSpreadIsLow() {
      return velocityArray[0].spread <= parseFloat(0.002);
    }

    function lastTwoWerePositive() {
      return (velocityArray[0].positive && velocityArray[1].positive)
    }

    function lastTwoVolumesAreHigherThanTwo() {
      return (parseInt(velocityArray[0].volume) > 2 && parseInt(velocityArray[1].volume) > 2);
    }

    function spreadIsLowerThanVelocity() {
      return (velocityArray[0].spread < velocityArray[0].askLowVelocity)
    }

    // GRAB AVGS AS WELL AS VELOCITY
    // AVGS CHECK AVG PIP CHANGE TO GET A BASELINE

    function allAlgos() {
      return (
        currentAskIsGraterThanLastByXTimes(4) &&
        currentSpreadIsLow() &&
        lastTwoWerePositive() &&
        lastTwoVolumesAreHigherThanTwo(),
        spreadIsLowerThanVelocity()
      );
    }

    if (allAlgos()) {
      return true;
    }

    return false;
  };

})(module.exports, require('colors'));
