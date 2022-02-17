const Moralis = require("moralis/node");
const fetch = require('node-fetch');

const serverUrl = "https://b7gujvtadxrb.usemoralis.com:2053/server"; //Moralis Server Url here
const appId = "LThR3x8bKUBMnn02S3qHu8pOe9d4EH0023cpkxdw"; //Moralis Server App ID here

Moralis.start({ serverUrl, appId });

const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

const collectionAddress = "0x5f73f4d79580d855dee138557d1c1fb0bbb3af95"; //Collection Address Here
const collectionName = "YOCOnauts"; //CollectionName Here

async function generateRarity() {
  const NFTs = await Moralis.Web3API.token.getAllTokenIds({
    address: collectionAddress,
    chain: 'matic',
    limit: 400,
    offset: 7
  });

  const totalNum = NFTs.total;
  const pageSize = NFTs.page_size;
  console.log(totalNum);
  console.log(pageSize);
  let allNFTs = NFTs.result;

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let i = pageSize; i < totalNum; i = i + pageSize) {
    const NFTs = await Moralis.Web3API.token.getAllTokenIds({
      address: collectionAddress,
      chain: 'matic',
      offset: i,
    });

    allNFTs = allNFTs.concat(NFTs.result);
    await timer(6000);
  }

  // some nfts are missing metadata when fetched from moralis, syncing is behind or something so we fetch from token_uri
  allNFTs = await Promise.all(allNFTs.map(async (e) => {
    if (e?.metadata) {
      return e;
    } else {
      console.log('e', e);
      const res = await fetch(e?.token_uri || `https://bonez.mypinata.cloud/ipfs/QmXNZedQHgrGcVHcZnPo1qJxK7HPZAg78QAo773akhRVTD/${e?.token_id}.json`);
      const data = await res?.json();
      return {
        ...e,
        metadata: JSON.stringify({
          name: data.name,
          description: data.description,
          image: data.image,
          attributes: data.attributes
        })
      }
    }
  }));

  let metadata = allNFTs.map((e) => JSON.parse(e.metadata).attributes);

  let tally = { TraitCount: {} };

  for (let j = 0; j < metadata.length; j++) {
    let nftTraits = metadata[j].map((e) => e.trait_type);
    let nftValues = metadata[j].map((e) => e.value);

    let numOfTraits = nftTraits.length;

    if (tally.TraitCount[numOfTraits]) {
      tally.TraitCount[numOfTraits]++;
    } else {
      tally.TraitCount[numOfTraits] = 1;
    }

    for (let i = 0; i < nftTraits.length; i++) {
      let current = nftTraits[i];
      if (tally[current]) {
        tally[current].occurences++;
      } else {
        tally[current] = { occurences: 1 };
      }

      let currentValue = nftValues[i];
      if (tally[current][currentValue]) {
        tally[current][currentValue]++;
      } else {
        tally[current][currentValue] = 1;
      }
    }
  }

  const collectionAttributes = Object.keys(tally);
  let nftArr = [];
  for (let j = 0; j < metadata.length; j++) {
    let current = metadata[j];
    let totalRarity = 0;
    let percentage = 0;
    for (let i = 0; i < current.length; i++) {
      let rarityScore =
        1 / (tally[current[i].trait_type][current[i].value] / totalNum);
      current[i].rarityScore = rarityScore;
      totalRarity += rarityScore;
      percentage = tally[current[i].trait_type][current[i].value] / (totalNum * 0.01);
      current[i].percentage = Math.round(percentage)
    }

    let rarityScoreNumTraits =
      8 * (1 / (tally.TraitCount[Object.keys(current).length] / totalNum));
    current.push({
      trait_type: "TraitCount",
      value: Object.keys(current).length,
      rarityScore: rarityScoreNumTraits,
    });
    totalRarity += rarityScoreNumTraits;

    if (current.length < collectionAttributes.length) {
      let nftAttributes = current.map((e) => e.trait_type);
      let absent = collectionAttributes.filter(
        (e) => !nftAttributes.includes(e)
      );

      absent.forEach((type) => {
        let rarityScoreNull =
          1 / ((totalNum - tally[type].occurences) / totalNum);
        current.push({
          trait_type: type,
          value: null,
          rarityScore: rarityScoreNull,
        });
        totalRarity += rarityScoreNull;
      });
    }

    if (allNFTs[j].metadata) {
      allNFTs[j].metadata = JSON.parse(allNFTs[j].metadata);
      allNFTs[j].image = resolveLink(allNFTs[j].metadata.image);
    } else if (allNFTs[j].token_uri) {
      try {
        await fetch(allNFTs[j].token_uri)
          .then((response) => response.json())
          .then((data) => {
            allNFTs[j].image = resolveLink(data.image);
          });
      } catch (error) {
        console.log(error);
      }
    }
    console.log('current', current)

    nftArr.push({
      attributes: current,  
      rarity: totalRarity,
      token_id: allNFTs[j].token_id,
      image: allNFTs[j].image,
    });
  }

  nftArr.sort((a, b) => b.rarity - a.rarity);

  for (let i = 0; i < nftArr.length; i++) {
    nftArr[i].rank = i + 1;
    const newClass = Moralis.Object.extend(`${collectionName}Rarity`);
    const newObject = new newClass();

    newObject.set("attributes", nftArr[i].attributes);
    newObject.set("rarity", nftArr[i].rarity);
    newObject.set("tokenId", nftArr[i].token_id);
    newObject.set("rank", nftArr[i].rank);
    newObject.set("image", nftArr[i].image);

    await newObject.save();
    console.log(i);
  }
  
  return true
}

generateRarity()
.then( ( result ) => { console.log( result ) } )
.catch( ( error ) => { console.log( error ) } )