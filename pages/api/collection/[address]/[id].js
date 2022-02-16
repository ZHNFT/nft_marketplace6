// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const Moralis = require('moralis/node');

const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;
const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;

// opensea address uses capitals for some letters;
const NftProjects = [
  {
    chain: 'matic',
    name: 'Space Game - Marines & Aliens',
    address: '0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35',
    opensea: '0xdbe147fc80b49871e2a8D60cc89D51b11bc88b35'
  },
  {
    chain: 'matic',
    name: 'Chumbi Valley Official',
    address: '0x5492ef6aeeba1a3896357359ef039a8b11621b45',
    opensea: '0x5492Ef6aEebA1A3896357359eF039a8B11621b45'
  },
  {
    chain: 'matic',
    name: 'Evaverse Hoverboards',
    address: '0x9d29e9fb9622f098a3d64eba7d2ce2e8d9e7a46b',
    opensea: '0x9D29E9fb9622f098A3d64EBa7D2Ce2e8d9e7a46b'
  }
];

Moralis.start({ serverUrl, appId });

export default async function handler(req, res) {
  const { address, id } = req.query
  let status = 200;
  let data = null;

  try {
    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata({ chain: NftProjects[2].chain, address: address, token_id: id });
    data = tokenIdMetadata;

  } catch (error) {
    status = 500;
    data = error.message;
  }

  res.status(status).json({ data })
}
