((actionMachine) => {
  const { runActionQueue, addToActionQueue, readyToStart } = actionMachine;
  addToActionQueue('FETCH-PRICES', { name: 'FIRST-RUN' });

  const startTheLoopIntervalSpeed = 1000;
  const checkForProfitLoopIntervalSpeed = 250;
  const instantQueueLoopIntervalSpeed = 50;
  const defaultRetrySpeed = 1000;

  //require('./services/algoMachine').allPossibleAlgos();

  function checkForProfitLoop() {
    const checkForProfitLoop = setInterval(() => {
      addToActionQueue('PROFIT-CHECK', { name: 'CHECK-FOR-PROFIT-LOSS' });
      addToActionQueue('PROFIT-CHECK', { name: 'CHECK-FOR-SURGE' });
      runActionQueue('PROFIT-CHECK');
    }, checkForProfitLoopIntervalSpeed);
  }

  // if its every second then consider waiting to start at an even second so that it
  // can be syncd with real time aka 10:00:00 seconds or the next even seconds from now

  // consider using another account or even API purely for gets and a another for placing orders
  function startTheLoop () {
    if (readyToStart() === false) {
      runActionQueue('FETCH-PRICES');
      setTimeout(() => {
        return startTheLoop();
      }, startTheLoopIntervalSpeed);
    } else {
      checkForProfitLoop();
      let fetchPriceLoop = setInterval(() => {
        addToActionQueue('FETCH-PRICES', { name: 'FETCH-BTC-USD' });
        runActionQueue('FETCH-PRICES');
      }, defaultRetrySpeed);
    }
  };

  function startUpdateLoop(){
    const instantQueueLoop = setInterval(() => {
      runActionQueue('INSTANT');
    }, instantQueueLoopIntervalSpeed);
  }

  startUpdateLoop();
  startTheLoop();

})(require('./services/actionMachine'));
