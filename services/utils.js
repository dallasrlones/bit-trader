((utils) => {

  utils.getAverage = arr => arr.reduce( ( p, c ) => parseFloat(p) + parseFloat(c), 0 ) / arr.length;

  utils.generateAverages = (fullYearsTicksInSeconds) => ({
    twentyEightDayAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 24 * 28))),
    fifteenDayAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 24 * 15))),
    sevenDayAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 24 * 7))),
    dayAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 24))),
    twelveHrAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 12))),
    sixHrAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 6))),
    threeHrAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 3))),
    twoHrAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60 * 2))),
    oneHrAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 60))),
    thirtyMinAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 30))),
    fifteenMinAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 15))),
    fiveMinAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, (60 * 5))),
    oneMinAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, 60)),
    thirtySecondAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, 30)),
    lastFiveAvg: utils.getAverage(fullYearsTicksInSeconds.slice(0, 5)),
  });

})(module.exports);
