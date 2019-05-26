(({ stateMachine, algoMachine }) => {
  const { getState, setState } = stateMachine;

  module.exports = (params, done) => {
    const fullYearsTicksInSeconds = getState('BTC-USD-PRICES-YEAR');
    const currentAvgs = getState('CURRENT-BTC-USD-AVERAGES');
    const currentAlgoProfit = getState('BTC-USD-ALGO-CURRENT-PROFIT');

    // run new algo and if more profitable than current change algo
    // run possible scenarios for buying and selling

    // buy will be if current price is X * current price by Y time back
    // sell will be X % profit loss

    // store profit of all possible algos
    // set the sell as well
    const allPossibleAlgos = algoMachine.allPossibleAlgos(currentAvgs);
    for (var tick in fullYearsTicksInSeconds) {
      // run the loop of seconds only once and test each algo on that single loop
      for(var algo in allPossibleAlgos) {
        if (allPossibleAlgos[algo](currentAvgs)) {
          //
        }
      }
    }

  };

})
(
  require('../services')
);
