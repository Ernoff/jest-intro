const fetch = require('node-fetch');
const chalk = require('chalk');
const inquirer = require('inquirer');
const opn = require('opn');

const generateDataUrl = (id, name) => `http://steamcommunity.com/market/priceoverview/?appid=${id}&country=DE&currenccy=3&market_hash_name=${encodeURIComponent(name.toUpperCase())}`;
const generateUserUrl = (id, name) => `http://steamcommunity.com/market/listings/${id}/${encodeURIComponent(name.toUpperCase())}`;


exports.command = '*';

exports.describe = "get ID for a given app id and given name";

exports.builder = {
  id: {
    default: '578080',
  },
  name: {
    default: 'GAMESCOM INVITATIONAL CRATE',
  },
};

const getData = async ({id, name}) => {
  const dataUrl = generateDataUrl(id, name);

  const result = await fetch(dataUrl).then(r => r.json());
  return result;
};
exports.getData = getData;

exports.handler = async ({id, name}) => {

  const result = await getData({id, name});
  console.log(`Right Now ${chalk.bold('Gamescom Invitational Crate Costs')}: 
    ${chalk.red("- Lowest price:")}  ${chalk.green(result.lowest_price)} 
    ${chalk.red("- Median price:")}  ${chalk.blue(result.median_price)}
    ${chalk.red("- Volume:")}        ${chalk.yellow(result.volume)}`);

const prompts = [
  {
    type: 'confirm',
    name: 'openBrowser',
    message: 'You want to open the page?',
    default: false
  }
];

const {openBrowser} = await inquirer.prompt(prompts);
if (openBrowser) {
  const userUrl = generateUserUrl(id, name);
  opn(userUrl, {wait: false});
}
}