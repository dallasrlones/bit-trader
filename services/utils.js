((utils) => {

  function handleError(methodName, err){
    console.log(`${'utils'.yellow} - ${methodName} - ${err.toString().red}`);
    console.log(err);
    process.exit(1)
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
        if ( parseInt(i) < candlesArray.length - 1) {
          const lastCandle = candlesArray[parseInt(i) + 1];
          const currentCandle = candlesArray[i];
          const newAvgObj = {
            volume: currentCandle.volume,
            time: new Date(currentCandle.time).getTime(),
            spread: (parseFloat(currentCandle.ask.c) - parseFloat(currentCandle.bid.c)),
            positive: (parseFloat(currentCandle.ask.h) > parseFloat(currentCandle.ask.l)),

            bidOpen: parseFloat(currentCandle.bid.o),
            bidClose: parseFloat(currentCandle.bid.c),

            askOpen: parseFloat(currentCandle.ask.o),
            askClose: parseFloat(currentCandle.ask.c),

            bidLowVelocity: utils.getPipChange(lastCandle.bid.l, currentCandle.bid.l),
            bidHighVelocity: utils.getPipChange(lastCandle.bid.h, currentCandle.bid.h),
            midLowVelocity: utils.getPipChange(lastCandle.mid.l, currentCandle.mid.l),
            midHighVelocity: utils.getPipChange(lastCandle.mid.h, currentCandle.mid.h),
            askLowVelocity: utils.getPipChange(lastCandle.ask.l, currentCandle.ask.l),
            askHighVelocity: utils.getPipChange(lastCandle.ask.h, currentCandle.ask.h)
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
      return results += parseFloat(listItem);
    }, 0) / list.length;

    return theAvg.toFixed(3);
  }

  utils.generateAveragesFromVelocityArray = velocityArray => {

    try {
      const averagesObj = velocityArray.reduce((results, velocityObj) => {
        const {
          volume,
          time,
          bidLowVelocity,
          bidHighVelocity,
          midLowVelocity,
          midHighVelocity,
          askLowVelocity,
          askHighVelocity,
          spread,
          positive,
        } = velocityObj;

        results.volumeList.push(volume);
        results.bidLowVelocityList.push(bidLowVelocity);
        results.bidHighVelocityList.push(bidHighVelocity);
        results.midLowVelocityList.push(midLowVelocity);
        results.midHighVelocityList.push(midHighVelocity);
        results.askLowVelocityList.push(askLowVelocity);
        results.askHighVelocityList.push(askHighVelocity);
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
        bidLowVelocityAvgs: generateAverage(averagesObj.bidLowVelocityList),
        bidHighVelocityAvgs: generateAverage(averagesObj.bidHighVelocityList),
        midLowVelocityAvgs: generateAverage(averagesObj.midLowVelocityList),
        midHighVelocityAvgs: generateAverage(averagesObj.midHighVelocityList),
        askLowVelocityAvgs: generateAverage(averagesObj.askLowVelocityList),
        askHighVelocityAvgs: generateAverage(averagesObj.askHighVelocityList),

        volumeAvgs: generateAverage(averagesObj.volumeList),
        spreadAvgs: generateAverage(averagesObj.spreadList)
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

    const {
      volumeAvgs,
      bidLowVelocityAvgs,
      bidHighVelocityAvgs,
      midLowVelocityAvgs,
      midHighVelocityAvgs,
      askLowVelocityAvgs,
      askHighVelocityAvgs,
      spreadAvgs
    } = utils.generateAveragesFromVelocityArray(velocityArray);

    const currentPriceObj = {};
    const currentCustomCandle = velocityArray[0];

    // AVGS functions

    // bid AVGS

    // low
    function currentCustomCandleIsAboveAverageBidLowVelocityByX(x) {
      return (currentCustomCandle.bidLowVelocity > parseFloat(bidLowVelocityAvgs * x));
    }

    // mid
    function currentCustomCandleIsAboveAverageBidMidVelocityByX(x) {
      return (currentCustomCandle.bidMidVelocity > parseFloat(bidMidVelocityAvgs * x));
    }

    // high
    function currentCustomCandleIsAboveAverageBidHighVelocityByX(x) {
      return (currentCustomCandle.bidHighVelocity > parseFloat(bidHighVelocityAvgs * x));
    }

    // asks AVGS

    // low
    function currentCustomCandleIsAboveAverageAskLowVelocityByX(x) {
      return (currentCustomCandle.askLowVelocity > parseFloat(askLowVelocityAvgs * x));
    }

    // mid
    function currentCustomCandleIsAboveAverageAskMidVelocityByX(x) {
      return (currentCustomCandle.askMidVelocity > parseFloat(askMidVelocityAvgs * x));
    }

    // high
    function currentCustomCandleIsAboveAverageAskHighVelocityByX(x) {
      return (currentCustomCandle.askHighVelocity > parseFloat(askHighVelocityAvgs * x));
    }

    function currentCustomCandleBidIsAboveAverageAskHighVelocityByX(x) {
      return (currentCustomCandle.bidHighVelocity > parseFloat(askHighVelocityAvgs * x));
    }

    // VELOCITIES functions

    function currentCustomCandleBidLowIsGraterThanLastAskHighByXTimes(x) {
      return currentCustomCandle.bidLowVelocity > parseFloat(velocityArray[1].askHighVelocity * x);
    }

    function currentCustomCandleSpreadIsLowerThanX(x) {
      return currentCustomCandle.spread <= parseFloat(x);
    }

    function lastXVelocityCandlesWerePositive(x) {
      for (var i = 0; i <= x; i++) {
        if (velocityArray[i].positive === false){
          return false;
        }
      }
      return true;
    }

    function lastXVelocityCandleVolumesAreHigherThanLimit(x, limit) {
      for(var i = 0; i <= limit; i++) {
        if (velocityArray[i].volume < limit) {
          return false;
        }
      }
      return true;
    }

    function spreadIsLowerThanAskLowVelocityTimesX(x) {
      return (parseFloat(currentCustomCandle.spread * x) < currentCustomCandle.askLowVelocity);
    }

    function eldersForceIndexOverXAmount(candlesArray, x) {
      const getEFI = (currentClose, previousClose, volume) => ((currentClose - previousClose) * volume);
      // bid is the close
      // (CurrentPeriodClose - (PreviousPeriod Close) X Volume = EFI
      // 13 Period Exponential Moving Average of EFI = EFI (13)

      const efiResults = [];

      for (var i = 0; i <= 13; i++) {
        // candles are 181 so we have an index offset to track stuff
        if (parseInt(i) !== 13) {
          const currentCandle = candlesArray[i];
          const previousCandle = candlesArray[parseInt(i +  1)];

          // is volume the candle volume or the volume of itterations?
          // total volume?
          const theEFI = getEFI(currentCandle.bidClose, previousCandle.bidClose, currentCandle.volume).toFixed(3);
          efiResults.push(theEFI);
        }
      }

      const theQuestion = (
        parseFloat(efiResults[0]) >= x &&
        parseFloat(efiResults[0]) > parseFloat(efiResults[1]) &&
        parseFloat(efiResults[2]) <= 0
      );
      if (theQuestion) {
        console.log('THE EFI', efiResults[0]);
      }
      return theQuestion;
    }

    // GRAB AVGS AS WELL AS VELOCITY
    // AVGS CHECK AVG PIP CHANGE TO GET A BASELINE

    function allAlgos() {
      return (
        // currentCustomCandleBidLowIsGraterThanLastAskHighByXTimes(4) &&
        // currentCustomCandleSpreadIsLowerThanX(0.002) &&
        lastXVelocityCandlesWerePositive(2) &&
        // lastXVelocityCandleVolumesAreHigherThanLimit(2, 2) &&
        // spreadIsLowerThanAskLowVelocityTimesX(3),
        // currentCustomCandleBidIsAboveAverageAskHighVelocityByX(3)
        eldersForceIndexOverXAmount(velocityArray, .1)
      );
    }

    if (allAlgos()) {
      return true;
    }

    return false;
  };

})(module.exports, require('colors'));
