((instantQueue, { stateMachine, actionMachine, utils, playSound }) => {
  const { getState } = stateMachine;
  const { runActionQueue, addToActionQueue } = actionMachine;

  let instantQueueLoop = false;

  instantQueue.startInstantQueue = (instantQueueLoopIntervalSpeed) => {
    instantQueueLoop = setInterval(() => {
      if (getState('OANDA-ACCOUNT-PRIMARY') !== undefined) {
        addToActionQueue('INSTANT', { name: 'CHECK-FOR-PROFIT-LOSS' });

        if (getState('OANDA-HYDRATED') !== undefined) {
          addToActionQueue('INSTANT', { name: 'UPDATE-AVERAGES' });
          addToActionQueue('INSTANT', { name: 'CHECK-FOR-SURGE' });
        }
      }

      runActionQueue('INSTANT');
    }, instantQueueLoopIntervalSpeed);
  };

  instantQueue.stopInstantQueue = () => {
    clearInterval(instantQueueLoop);
  };

  module.exports = instantQueue;
})
(
  { },
  require('../services')
)
