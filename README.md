# bit-trader

## SETUP

  To setup the system you need to create a file called env.json in the root folder (where package.json lives)

  An example env.json file is located in the examples folder

## CODING GUIDE

  All AJAX calls must be made in an Action, then update state using stateMachine getState and setState

  This allows us to put a 150 call limit per second on all of our AJAX calls

## RULES

  The first rule of bit_trader, is don't talk about bit_trader :P
  Just kidding, you can tell your friends but DO NOT try to sell this to anyone.

  This has to be a secret, between close friends, VIP private only.

  This is 100% open source between friends, if you make any changes please make a PR
  as so will I.

  When rings combined we can captain planet this shit.

## How it all works

  There are two loops, one to get data and one to make trades (buy/sell)

  The first loop runs every second, this fetches the data

  The second loop runs every half a second, this processes the data and makes the buy/sell
  decisions when there is a match for the algo  

## Limits

  We are limited to 120 API calls in a single second

## TO-DO

  Modify average generator to include spread values

  Change percentages changed, that shits wack

  Add a buy and sell in progress so no duplicates

  Save candle info to DB or see if it can fit in cache

  Create candles catch up to last bulk date

  Update candle data set every 5 seconds with new pricing live data

  Possibility: If you can only fetch per S5 (5 seconds) go back 5 times with a second offset to grab all 1S for the month
