((actionMachine, { stateMachine }) => {
  const { runActionQueue, addToActionQueue, readyToStart } = actionMachine;
  addToActionQueue('FETCH-PRICES', { name: 'FIRST-RUN' });

  const startLoopsIntervalSpeed = 1000;
  const checkForProfitLoopIntervalSpeed = 250;
  const instantQueueLoopIntervalSpeed = 50;
  const defaultRetrySpeed = 1000;

  //require('./services/algoMachine').allPossibleAlgos();

  function checkForProfitLoop() {
    // THIS LOOP RUNS EVERY 250 MILLISECONDS
    const checkForProfitLoop = setInterval(() => {
      addToActionQueue('PROFIT-CHECK', { name: 'CHECK-BALANCES' });
      addToActionQueue('PROFIT-CHECK', { name: 'CHECK-FOR-PROFIT-LOSS' });
      addToActionQueue('PROFIT-CHECK', { name: 'CHECK-FOR-SURGE' });
      addToActionQueue('PROFIT-CHECK', { name: 'BTC-USD-VELOCITY' });
      runActionQueue('PROFIT-CHECK');
    }, checkForProfitLoopIntervalSpeed);
  }

  // if its every second then consider waiting to start at an even second so that it
  // can be syncd with real time aka 10:00:00 seconds or the next even seconds from now

  // consider using another account or even API purely for gets and a another for placing orders
  function startLoops () {
    if (readyToStart() === false) {
      runActionQueue('FETCH-PRICES');
      setTimeout(() => {
        return startLoops();
      }, startLoopsIntervalSpeed);
    } else {
      startUpdateLoop();
      checkForProfitLoop();
      let fetchPriceLoop = setInterval(() => {
        // THIS LOOP RUNS EVERY 1 SECOND
        addToActionQueue('FETCH-PRICES', { name: 'FETCH-BTC-USD' });
        addToActionQueue('FETCH-PRICES', { name: 'FETCH-BTC-BALANCES' });
        runActionQueue('FETCH-PRICES');
      }, defaultRetrySpeed);
    }
  };

  function startUpdateLoop(){
    // THIS LOOP RUNS EVERY 50 MILLISECONDS
    const instantQueueLoop = setInterval(() => {
      runActionQueue('INSTANT');
    }, instantQueueLoopIntervalSpeed);
  }

  startLoops();

})(require('./services/actionMachine'), require('./services'));
