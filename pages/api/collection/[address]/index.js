import withMoralis from '../../../../middleware/withMoralis';

async function handler(req, res) {
  const { Moralis, moralisOptions } = res;
  const { address } = req.query
  let status = 200;
  let data = null;
  let traits = null;

  try {
    const options = { ...moralisOptions, address, limit: 20, offset: 7 };
    const NFTs = await Moralis.Web3API.token.getAllTokenIds(options);
    data = NFTs;

    const nftTraits = Moralis.Object.extend("YOCOnautsTraits");
    const query = new Moralis.Query(nftTraits);
    traits = await query.find();

  } catch (error) {
    status = 500;
    data = error.message;
  }

  res.status(status).json({ data, traits })
}

export default withMoralis(handler);