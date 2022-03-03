const Moralis = require('moralis/node');

const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL_TESTNET // REACT_APP_MORALIS_SERVER_URL;
const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID_TESTNET // REACT_APP_MORALIS_APPLICATION_ID;

Moralis.start({ serverUrl, appId });

export default function useMoralis() {
  return Moralis;
}