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

})(module.exports, require('colors'));
