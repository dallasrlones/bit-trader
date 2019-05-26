((actionMachine) => {
  const { runActionQueue, addToActionQueue, readyToStart } = actionMachine;
  addToActionQueue('FETCH-PRICES', { name: 'FIRST-RUN' });

  let isReady = false;
  const fetchDataLoopIntervalSpeed = 1000;
  const checkForProfitLoopIntervalSpeed = 250;
  const defaultRetrySpeed = 1000;

  //require('./services/algoMachine').allPossibleAlgos();

  // if its every second then consider waiting to start at an even second so that it
  // can be syncd with real time aka 10:00:00 seconds or the next even seconds from now
  function fetchDataLoop () {
    if (readyToStart() === false) {
      runActionQueue('FETCH-PRICES');
      setTimeout(() => {
        return fetchDataLoop();
      }, fetchDataLoopIntervalSpeed);
    } else {
      isReady = true;
      let fetchPriceLoop = setInterval(() => {
        addToActionQueue('FETCH-PRICES', { name: 'FETCH-BTC-USD' });
        runActionQueue('FETCH-PRICES');
      }, defaultRetrySpeed);
    }
  };

  function checkForProfitLoop() {
    if (isReady) {
      const checkForProfitLoop = setInterval(() => {
        addToActionQueue('PROFIT-CHECK', { name: 'CHECK-FOR-PROFIT-LOSS' });
        addToActionQueue('PROFIT-CHECK', { name: 'CHECK-FOR-SURGE' });
        runActionQueue('PROFIT-CHECK');
      }, checkForProfitLoopIntervalSpeed);
    } else {
      setTimeout(() => {
        return checkForProfitLoop();
      }, defaultRetrySpeed);
    }
  }

  fetchDataLoop();
  checkForProfitLoop();

})(require('./services/actionMachine'));
