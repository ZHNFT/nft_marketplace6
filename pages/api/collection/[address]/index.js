// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Moralis = require('moralis/node');

const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL_BEN;
const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID_BEN;

// opensea address uses capitals for some letters;
const NftProjects = [
  {
    chain: 'matic',
    name: 'YOCOnauts',
    address: '0x5f73f4d79580d855dee138557d1c1fb0bbb3af95',
  }
];

Moralis.start({ serverUrl, appId });

export default async function handler(req, res) {
  const { address } = req.query
  let status = 200;
  let data = null;

  try {
    const options = { chain: NftProjects[0].chain, address: address, limit: 20, offset: 7 };
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    data = NFTs;

  } catch (error) {
    status = 500;
    data = error.message;
  }

  res.status(status).json({ data })
}
