import withMoralis from '../../../../middleware/withMoralis';

async function handler(req, res) {
  const { Moralis, moralisOptions } = res;
  const { address, id } = req.query
  let status = 200;
  let data = null;
  let rarity = null;

  try {
    const tokenIdMetadata = await Moralis.Web3API.token.getTokenIdMetadata({ ...moralisOptions, address, token_id: id });
    data = tokenIdMetadata;

    const nftRarity = Moralis.Object.extend("YOCOnautsRarity");
    const query = new Moralis.Query(nftRarity);
    query.equalTo("tokenId", `${id}`);
    rarity = await query.first();

  } catch (error) {
    status = 500;
    data = error.message;
  }

  res.status(status).json({ data, rarity })
}

export default withMoralis(handler);