((actionMachine, { stateMachine }) => {
  const { runActionQueue, addToActionQueue, readyToStart } = actionMachine;
  addToActionQueue('INSTANT', { name: 'FIRST-RUN' });

  const retrySpeed = 1000;
  const checkForProfitLoopIntervalSpeed = 200;
  const instantQueueLoopIntervalSpeed = 50;

  //require('./services/algoMachine').allPossibleAlgos();

  function checkForProfitLoop() {
    // THIS LOOP RUNS EVERY 250 MILLISECONDS
    const checkForProfitLoop = setInterval(() => {
      addToActionQueue('PROFIT-CHECK', { name: 'FETCH-ACCOUNT-DATA', hasAjax: true });
      // addToActionQueue('PROFIT-CHECK', { name: 'FETCH-PRICES' });
      addToActionQueue('PROFIT-CHECK', { name: 'UPDATE-CURRENT-PRICES', hasAjax: true });
      runActionQueue('PROFIT-CHECK');
    }, checkForProfitLoopIntervalSpeed);
  }

  // if its every second then consider waiting to start at an even second so that it
  // can be syncd with real time aka 10:00:00 seconds or the next even seconds from now

  // consider using another account or even API purely for gets and a another for placing orders
  function startLoops () {
    if (readyToStart() === false) {
      runActionQueue('INSTANT');
      setTimeout(() => {
        return startLoops();
      }, retrySpeed);
    } else {
      setTimeout(() => {
        startUpdateLoop();
        checkForProfitLoop();
      }, 5000)
    }
  };

  function startUpdateLoop(){
    // THIS LOOP RUNS EVERY 50 MILLISECONDS
    const instantQueueLoop = setInterval(() => {
      addToActionQueue('INSTANT', { name: 'CHECK-FOR-PROFIT-LOSS' });
      addToActionQueue('INSTANT', { name: 'UPDATE-AVERAGES' })
      addToActionQueue('INSTANT', { name: 'CHECK-FOR-SURGE' });
      runActionQueue('INSTANT');
    }, instantQueueLoopIntervalSpeed);
  }

  startLoops();

})(require('./services/actionMachine'), require('./services'));
