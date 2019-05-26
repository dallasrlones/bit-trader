((actionMachine, actions, newID, colors) => {
  let actionQueue = {};
  let readyToStart = false;

  // remove from this and use stateMachine
  actionMachine.readyToStart = () => readyToStart;
  // remove from this and use stateMachine
  actionMachine.setReadyToStart = () => {
    readyToStart = true;
  };

  actionMachine.runAction = (queueName, actionObj) => {
    try {
      const { name, params, isRunning, id } = actionObj;
      if (isRunning === false) {
        if (actions[name] !== undefined) {
          actionMachine.updateActionInQueue(queueName, id, { isRunning: true });
          actions[name](params, () => {
            actionMachine.removeFromActionQueue(queueName, id);
          });
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
        if (/* check has hardware resources */true) {
          actionMachine.runAction(queueName, actionObj);
        } else {
          return;
        }
      });
    } catch (err) {
      console.log(`${'services'.yellow}/actionMachine.js - ${'runActionQueue'.cyan} - ${err.toString().red}`);
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

  actionMachine.addToActionQueue = (queueName, actionObj) => {
    let newActionObj = { ...actionObj, id: newID(), isRunning: false };
    if (actionQueue[queueName] === undefined) {
      actionQueue[queueName] = [];
    }
    actionQueue[queueName].push(newActionObj);
  };

  actionMachine.removeFromActionQueue = (queueName, actionID) => {
    if (actionQueue[queueName] !== undefined) {
      actionQueue[queueName] = actionQueue[queueName].filter((action) => {
        return action.id !== actionID;
      });
    } else {
      console.log(`${'services'.yellow}/actionMachine.js - ${'removeFromActionQueue'.cyan} - ${queueName} does not exist`);
    }
  };

})(
  module.exports,
  require('../actions'),
  require('uuid/v1'),
  require('colors')
);
