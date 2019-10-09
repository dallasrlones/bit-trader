((actionMachine, actions, newID, { actionMachineError }) => {
  let actionQueue = {};
  let readyToStart = false;
  const maxCallCount = 50;
  let callCount = [];

  function hasCallsAvailable() {
    try {
      const now = new Date().getTime();

      const lowestDate = callCount.sort((a, b) => {
        return a - b;
      })[callCount.length] || new Date().getTime() - 1201;

      const callCountUnderLimit = (callCount.length < maxCallCount);
      const lastDateWasOverASecond = ((lowestDate + 1200) <= now);
      const canCall = (callCountUnderLimit === true && lastDateWasOverASecond === true);
      return canCall;
    } catch (err) {
      actionMachineError('hasCallsAvailable', err);
    }
  }

  function addToCallCount() {
    callCount.unshift(new Date().getTime());
  }

  function subtractFromCallCount() {
    callCount.pop();
  }

  actionMachine.addToActionQueue = (queueName, actionObj) => {
    try {
      let newActionObj = { ...actionObj, id: newID(), isRunning: false };
      if (actionQueue[queueName] === undefined) {
        actionQueue[queueName] = [];
      }
      actionQueue[queueName].push(newActionObj);
    } catch (err) {
      actionMachineError('addToActionQueue', err);
    }
  };

  actionMachine.removeFromActionQueue = (queueName, actionID) => {
    try {
      if (actionQueue[queueName] !== undefined || actionQueue[queueName].length > 0) {
        let currentQueue = [...actionQueue[queueName]];
        currentQueue = currentQueue.filter(({ id }) => (id !== actionID));
        actionQueue[queueName] = currentQueue;
      } else {
        console.log(`${'services'.yellow}/actionMachine.js - ${'removeFromActionQueue'.cyan} - ${queueName} does not exist`);
      }
    } catch (err) {
        actionMachineError('removeFromActionQueue', err);
    }
  };

  actionMachine.updateActionInQueue = (queueName, id, newObj) => {
    try {
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
    } catch (err) {
      actionMachineError('updateActionInQueue', err);
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
            actions[name](params, () => {
              actionMachine.removeFromActionQueue(queueName, id);
            }, () => {
              actionMachine.updateActionInQueue(queueName, id, { isRunning: false });
            });
          }
        } else {
          console.log(` Action: ${name} is not bound to actions `.bgWhite.red);
        }
      }
    } catch (err) {
      actionMachineError('runAction', err);
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
      actionMachineError('runActionQueue', err);
    }
  };

})(
  module.exports,
  require('../actions'),
  require('uuid/v1'),
  require('./errorHandlers'),
  require('colors')
);
