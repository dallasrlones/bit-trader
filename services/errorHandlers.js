((errorHandlers, { playSound, addToSoundQueueTop, clearSoundQueue }, { danger, warning }, actionMachine) => {

  function playError() {
    playSound('error.mp3');
  }

  errorHandlers.actionsError = (actionName, err) => {
    playError();
    if (err.toString().trim() !== ''){
      console.log(` ${'ACTION'.green} - ${actionName} - ${err.toString().red || 'err is undefined'.red}`);
      console.log(err);
    }
  };

  errorHandlers.ajaxError = (methodName, err, reject) => {
    playError();
    if (
      err.code === 'ECONNRESET' ||
      err.errno === 'ENOTFOUND' ||
      err.errno === 'ENETUNREACH' ||
      err.errno === 'EADDRNOTAVAIL' ||
      err.code === 'ECONNABORTED'
    ) {
      danger(` CONNECTION LOST - ${(' ' + methodName + ' ').bgWhite.red}`);
      const { setState, clearCustomCandles } = require('./stateMachine');
      setState('ONLINE', false);
      clearCustomCandles();

      addToSoundQueueTop('alarm.mp3', () => {
        addToSoundQueueTop('cant_find_source.mp3', () => {
          addToSoundQueueTop('EXIT');
        });
      });

      return reject('');
    }

    danger(` ${'AJAX'.cyan} - ${methodName} - ${err.toString().red}`);
    console.log(err);
    reject(err);
  };

  errorHandlers.actionMachineError = (methodName, err) => {
    playError();
    console.log(` services/${'actionMachine.js'.yellow} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  };

  errorHandlers.stateMachineError = (methodName, err) => {
    playError();
    console.log(` services/${'stateMachine.js'.magenta} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  };

  errorHandlers.soundServiceError = (methodName, err) => {
    playError();
    console.log(` services/${'soundService.js'.blue} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  };

  errorHandlers.utilsError = (methodName, err) => {
    playError();
    console.log(` services/${'utils.js'.yellow} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  };

  errorHandlers.algoMachineError = (methodName, err) => {
    playError();
    console.log(` services/${'algoMachine.js'.cyan} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  };

  module.exports = errorHandlers;
})
(
  {},
  require('./soundService'),
  require('./utils'),
  require('./actionMachine'),
  require('colors')
);
