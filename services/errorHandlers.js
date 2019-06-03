((errorHandlers, { playSound }) => {

  function playError() {
    playSound('error.mp3');
  }

  errorHandlers.actionsError = (actionName, err) => {
    playError();
    console.log(` ${'ACTION'.green} - ${actionName} - ${err.toString().red}`);
    console.log(err);
  };

  errorHandlers.ajaxError = (methodName, err, reject) => {
    playError();
    console.log(` ${'OANDA'.cyan} - ${methodName} - ${err.toString().red}`);
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
  require('colors')
);
