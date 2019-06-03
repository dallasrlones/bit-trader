((actionMachine, actions, newID, colors) => {
  let actionQueue = {};
  let readyToStart = false;
  const maxCallCount = 100;
  let callCount = [];

  function hasCallsAvailable() {
    const now = new Date().getTime();

    const lowestDate = callCount.sort((a, b) => {
      return a - b;
    })[callCount.length] || new Date().getTime() - 1201;

    const callCountUnderLimit = (callCount.length < maxCallCount);
    const lastDateWasOverASecond = ((lowestDate + 1200) <= now);
    const canCall = (callCountUnderLimit === true && lastDateWasOverASecond === true);
    return canCall;
  }

  function addToCallCount() {
    callCount.unshift(new Date().getTime());
  }

  function subtractFromCallCount() {
    callCount.pop();
  }

  // remove from this and use stateMachine
  actionMachine.readyToStart = () => readyToStart;
  // remove from this and use stateMachine
  actionMachine.setReadyToStart = () => {
    readyToStart = true;
  };

  actionMachine.addToActionQueue = (queueName, actionObj) => {
    let newActionObj = { ...actionObj, id: newID(), isRunning: false };
    if (actionQueue[queueName] === undefined) {
      actionQueue[queueName] = [];
    }
    actionQueue[queueName].push(newActionObj);
  };

  actionMachine.removeFromActionQueue = (queueName, actionID) => {
    if (actionQueue[queueName] !== undefined || actionQueue[queueName].length > 0) {
      let currentQueue = [...actionQueue[queueName]];
      currentQueue = currentQueue.filter(({ id }) => (id !== actionID));
      actionQueue[queueName] = currentQueue;
    } else {
      console.log(`${'services'.yellow}/actionMachine.js - ${'removeFromActionQueue'.cyan} - ${queueName} does not exist`);
    }
  };

  actionMachine.updateActionInQueue = (queueName, id, newObj) => {
    if (actionQueue[queueName] !== undefined) {
      actionQueue[queueName] = actionQueue[queueName].map(actionObj => {
        if (actionObj.id !== id) {
          return actionObj;
        } else {
          return { ...actionObj, ...newObj };
        }
      });
    } else {
      console.log(`${'services'.yellow}/actionMachine.js - ${'updateActionInQueue'.cyan} - ${queueName} does not exist`);
    }
  };

  actionMachine.runAction = (queueName, actionObj) => {
    try {
      const { name, params, isRunning, id, hasAjax } = actionObj;
      if (isRunning === false) {
        if (actions[name] !== undefined) {
          actionMachine.updateActionInQueue(queueName, id, { isRunning: true });

          if (hasAjax === true) {
            if (hasCallsAvailable() === true) {
              addToCallCount();
              actions[name](params, () => {
                actionMachine.removeFromActionQueue(queueName, id);
                subtractFromCallCount();
              }, () => {
                actionMachine.updateActionInQueue(queueName, id, { isRunning: false });
              });
            } else {
              actionMachine.updateActionInQueue(queueName, id, { isRunning: false });
            }
          } else {
            //console.log('no ajax');
            actions[name](params, () => {
              actionMachine.removeFromActionQueue(queueName, id);
            });
          }
        } else {
          console.log(` Action: ${name} is not bound to actions `.bgWhite.red);
        }
      }
    } catch (err) {
      console.log(`${'services'.yellow}/actionMachine.js - ${'runAction'.cyan} - ${err.toString().red}`);
      console.log(' This usually means the action is not exporting correctly '.bgWhite.red);
      console.log(` queueName - ${queueName} `);
      console.log(' actionObj ', actionObj);
      console.log(err);
    }
  };

  actionMachine.runActionQueue = queueName => {
    try {
      if (actionQueue[queueName] === undefined) {
        actionQueue[queueName] = [];
      }

      actionQueue[queueName].forEach(actionObj => {
        actionMachine.runAction(queueName, actionObj);
      });
    } catch (err) {
      console.log(`${'services'.yellow}/actionMachine.js - ${'runActionQueue'.cyan} - ${err.toString().red}`);
    }
  };

})(
  module.exports,
  require('../actions'),
  require('uuid/v1'),
  require('colors')
);
