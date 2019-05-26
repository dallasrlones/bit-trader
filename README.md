# bit-trader

## How it all works

  There are two loops, one to get data and one to make trades (buy/sell)

  The first loop runs every second, this fetches the data

  The second loop runs every half a second, this processes the data and makes the buy/sell
  decisions when there is a match for the algo  

## Limits

  We are limited to 2.6 API calls in a single second, thus every 1 second a
  fetch will be made to get the most recent pricing
