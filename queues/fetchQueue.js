((fetchQueue, { stateMachine, actionMachine, utils, playSound }) => {
  const { runActionQueue, addToActionQueue } = actionMachine;
  let fetchQueueLoop = false;

  fetchQueue.startFetchQueue = (fetchQueueLoopIntervalSpeed) => {
    fetchQueueLoop = setInterval(() => {

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
