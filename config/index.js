((config, fs, player) => {


  try {
    const env = JSON.parse(fs.readFileSync(`${process.cwd()}/env.json`).toString());

    config.baseOandaUrl = 'https://api-fxpractice.oanda.com';
    // DO NOT UNCOMMENT UNTIL YOU ARE COMFORTABLE ITS READY FOR LIVE
    // config.baseOandaUrl = 'https://api-fxtrade.oanda.com/v3';
    config.oandaAuthHeader = `Bearer ${env['OANDA-KEY']}`;
  } catch (err) {
    console.log(' CREATE A env.json FILE IN THE ROOT, LOOK AT THE EXAMPLES FOLDER '.bgYellow.red);
    player.play('sounds/config_not_set.wav', () => {});
    process.exit(1);
  }


})(module.exports, require('fs'), require('play-sound')(opts = {}), require('colors'));
