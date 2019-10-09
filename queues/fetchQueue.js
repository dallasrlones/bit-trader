((fetchQueue, { stateMachine, actionMachine, utils, playSound }) => {
  const { runActionQueue, addToActionQueue } = actionMachine;
  const { getCurrentTick, setCurrentTick } = stateMachine;
  let fetchQueueLoop = false;

  fetchQueue.startFetchQueue = (fetchQueueLoopIntervalSpeed) => {
    setCurrentTick(0);
    fetchQueueLoop = setInterval(() => {
      if (getCurrentTick() > 4) {
        setCurrentTick(0);
      }

      // teardown func
      setTimeout(() => {
        setCurrentTick(getCurrentTick() + 1);
      }, fetchQueueLoopIntervalSpeed - 1);

      addToActionQueue('FETCH', { name: 'UPDATE-ACCOUNT-DATA', hasAjax: true });
      addToActionQueue('FETCH', { name: 'UPDATE-CURRENT-PRICES', hasAjax: true });
      addToActionQueue('FETCH', { name: 'UPDATE-AVAILABLE-INSTRUMENTS', hasAjax: true });

      runActionQueue('FETCH');
    }, fetchQueueLoopIntervalSpeed);
  };

  fetchQueue.stopFetchQueue = () => {
    clearInterval(fetchQueueLoop);
  };

  module.exports = fetchQueue;
})
(
  { },
  require('../services')
)
