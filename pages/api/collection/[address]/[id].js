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
  const { address, id } = req.query
  let status = 200;
  let data = null;
  let rarity = null;

  try {
    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata({ chain: NftProjects[0].chain, address: address, token_id: id });
    data = tokenIdMetadata;

    const nftRarity = Moralis.Object.extend("YOCOnautsRarity");
    const query = new Moralis.Query(nftRarity);
    query.equalTo("tokenId", `${id}`);
    rarity = await query.first();

  } catch (error) {
    status = 500;
    data = error.message;
  }
  console.log('rarity', rarity);
  res.status(status).json({ data, rarity })
}
