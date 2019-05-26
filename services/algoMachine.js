((algoMachine, fs, newID) => {

  algoMachine.allPossibleAlgos = () => {
    const allPossibleAlgos = [];

    let count = 0;

    const allPossibleSets = list => {
      console.log('STARTING POSSIBLE LOOP'.blue);
        var set = [],
            listSize = list.length,
            combinationsCount = (1 << listSize),
            combination;

        for (var i = 1; i < combinationsCount ; i++ ){
            var combination = [];
            for (var j = 0; j < listSize; j++ ) {
                if ( (i & (1 << j) ) ) {
                    combination.push(list[j]);
                }
            }
            //set.push(combination);
            // fs.writeFile(`${process.cwd()}/algos/algo-${newID()}.json`, JSON.stringify(combination, null, 2), () => {
            //
            // });
            count += 1;
        }
        //return set;
        console.log(count.toString().yellow);
    }

    // 100 represents x 100 times of change
    for (var i = 0; i <= 100; i++) {
      const dynamicOneHrAvgFunc = `({
        oneHrAvg,
      }) => {
        return (oneHrAvg * ${i}) >= currentPrice;
      }`;
      allPossibleAlgos.push(dynamicOneHrAvgFunc);

      const dynamicThirtyMinAvg = `({
        thirtyMinAvg,
      }) => {
        return (thirtyMinAvg * ${i}) >= currentPrice;
      }`;
      allPossibleAlgos.push(dynamicThirtyMinAvg);

      const dynamicFiveMinAvg = `({
        fiveMinAvg,
      }) => {
        return (fiveMinAvg * ${i}) >= currentPrice;
      }`;
      allPossibleAlgos.push(dynamicFiveMinAvg);

      const dynamicOneMinAvg = `({
        oneMinAvg,
      }) => {
        return (oneMinAvg * ${i}) >= currentPrice;
      }`;
      allPossibleAlgos.push(dynamicOneMinAvg);

      const dynamicThirtySecondAvg = `({
        thirtySecondAvg,
      }) => {
        return (thirtySecondAvg * ${i}) >= currentPrice;
      }`;
      allPossibleAlgos.push(dynamicThirtySecondAvg);

      const dynamicLastFiveAvg = `({
        lastFiveAvg,
      }) => {
        return (lastFiveAvg * ${i}) >= currentPrice;
      }`;
      allPossibleAlgos.push(dynamicLastFiveAvg);
    }

    console.log('DONE GENERATING 100 PERCENTAGES');

    allPossibleSets(allPossibleAlgos);
  };

})
(
  module.exports,
  require('fs'),
  require('uuid/v1'),
  require('colors')
);
