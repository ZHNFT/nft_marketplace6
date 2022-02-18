import withMoralis from '../../middleware/withMoralis';

async function handler(req, res) {
  const { Moralis, moralisOptions } = res;
  let status = 200;
  let data = null;

  try {
    const metaData = await Moralis.Web3API.token.getNFTMetadata(moralisOptions);
    data = metaData;

  } catch (error) {
    status = 500;
    data = error.message;
  }

  res.status(status).json({ data })
}

export default withMoralis(handler);