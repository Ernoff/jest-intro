/* eslint-dev jest */

// npm packages
const nock = require('nock');

// our packages
const {getData, handler} = require('./main');

const gamesCrate = {
    id: '578080',
    name : 'GAMESCOM INVITATIONAL CRATE'
};

describe('Main function', () => {
  let steamComm;

  beforeAll(() => {
    const url = `/market/priceoverview/?appid=${gamesCrate.id}&country=DE&currenccy=3&market_hash_name=${encodeURIComponent(gamesCrate.name)}`
    steamComm = nock('http://steamcommunity.com')
      .get(url)
      .reply(200, {
        lowest_price: "$7.25 USD",
        median_price: "$7.19 USD",
        success: true,
        volume: "8,080"
      })
  });

  afterAll(()=> {
    steamComm.cleanAll();
  });
  test('Get default data', async done => {
   const result = await getData(gamesCrate);
    expect(result).toEqual({lowest_price: "$7.25 USD", median_price: "$7.19 USD", success: true, volume: "8,080"});
    done();
  });
});