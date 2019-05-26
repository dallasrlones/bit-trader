# bit-trader

## RULES

  The first rule of bit_trader, is don't talk about bit_trader :P
  Just kidding, you can tell your friends but DO NOT try to sell this to anyone.

  This has to be a secret, between close friends, VIP private only.

  This is 100% open source between friends, if you make any changes please make a PR
  as so will I.

  When wrings combined we can captain planet this shit.

## How it all works

  There are two loops, one to get data and one to make trades (buy/sell)

  The first loop runs every second, this fetches the data

  The second loop runs every half a second, this processes the data and makes the buy/sell
  decisions when there is a match for the algo  

## Limits

  We are limited to 2.6 API calls in a single second, thus every 1 second a
  fetch will be made to get the most recent pricing
