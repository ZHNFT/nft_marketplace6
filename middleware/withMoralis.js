const Moralis = require('moralis/node');

const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL; // REACT_APP_MORALIS_SERVER_URL_BEN
const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID; // REACT_APP_MORALIS_APPLICATION_ID_BEN

const NftProjects = [
  {
    chain: 'matic',
    name: 'YOCOnauts',
    address: '0x5f73f4d79580d855dee138557d1c1fb0bbb3af95',
  }
];

Moralis.start({ serverUrl, appId });

export default function withMoralis(handler) {
  return async function (req, res) {
    res.Moralis = Moralis;
    res.moralisOptions = { chain: NftProjects[0].chain, address: NftProjects[0].address };

    return handler(req, res);
  }
}