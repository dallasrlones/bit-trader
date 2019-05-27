((config, fs) => {

  const env = JSON.parse(fs.readFileSync(`${process.cwd()}/env.json`).toString());

  config.baseOandaUrl = 'https://api-fxpractice.oanda.com';
  // DO NOT UNCOMMENT UNTIL YOU ARE COMFORTABLE ITS READY FOR LIVE
  // config.baseOandaUrl = 'https://api-fxtrade.oanda.com/v3';
  config.oandaAuthHeader = `Bearer ${env['OANDA-KEY']}`;

})(module.exports, require('fs'));
