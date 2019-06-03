((errorHandlers, { playSound }, { danger, warning }) => {

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
      err.errno === 'ECONNRESET' ||
      err.toString() === 'Error: timeout of 5000ms exceeded'
    ) {
      warning(' INTERNET SHIT THE BED ');
      playSound('connection_unstable.mp3', undefined, 1500);
      return reject('');
    } else if (err.errno === 'ENOTFOUND' || err.errno === 'ENETUNREACH' || err.errno === 'EADDRNOTAVAIL') {
      danger(' CONNECTION LOST ');
      require('./stateMachine').setState('ONLINE', false);
      setTimeout(() => {
        playSound('cant_find_source.mp3', undefined, 2500);
      }, 1000);
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
    console.log(` services/${'utils.js'.cyan} - ${methodName} - ${err.toString().red}`);
    console.log(err);
  };


  module.exports = errorHandlers;
})
(
  {},
  require('./soundService'),
  require('./utils'),
  require('colors')
);
