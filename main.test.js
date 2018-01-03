/* eslint-dev jest */

// npm packages
const nock = require('nock');
const sinon = require('sinon');
const inquirer = require('inquirer');
// our packages
const {getData, handler} = require('./main');

const gamesCrate = {
  id: '578080',
  name : 'GAMESCOM INVITATIONAL CRATE'
};

// mocks opn function
jest.mock('opn');
const opn = require('opn');

describe('Main function', () => {
  let steamComm;

  beforeAll(() => {

    const url = `/market/priceoverview/?appid=${gamesCrate.id}&country=DE&currenccy=3&market_hash_name=${encodeURIComponent(gamesCrate.name)}`
    steamComm = nock('http://steamcommunity.com')
      .get(url)
      .times(3)
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
    expect(result).toMatchSnapshot();
    done();
  });

  test('Renders correct data to a User', async done => {
    //stub the reply from user
    const inqStub = sinon.stub(inquirer, 'prompt').callsFake(() => ({openBrowser:false}))
    
    // tab in console log function
    const consoleSpy = sinon.spy(console, 'log');
    // execute main logic
    await handler(gamesCrate);
    consoleSpy.restore();
    expect(consoleSpy.args).toMatchSnapshot();
    inqStub.restore();
    done();
  });

  test('Open browser on user request', async done => {
    //stub the reply from user
    const inqStub = sinon.stub(inquirer, 'prompt').callsFake(() => ({openBrowser:true}));
    const consoleSpy = sinon.spy(console, 'log');
    await handler(gamesCrate);
    consoleSpy.restore();
    expect(consoleSpy.args).toMatchSnapshot();
    expect(opn).toBeCalled();
    inqStub.restore();
    done();
  });


});