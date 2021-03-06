const API_HOST = 'https://api.hexag0n.io';

/**
 * Returns the URL for a collection.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.address - The collection address.
 * @returns {String} The collection URL.
 */
 const collectionUrl = ({ address }) => (
  `${API_HOST}/collections/${address}`
);

/**
 * Returns the URL for an NFT item.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.address - The collection address.
 * @param {String} obj.id - The token ID.
 * @returns {String} The NFT item URL.
 */
 const nftUrl = ({ address, id }) => (
  `${API_HOST}/collections/${address}/token/${id}`
);

/**
 * Returns the URL for searching a collection.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.searchTerm - The search term.
 * @returns {String} The collection search URL.
 */
 const searchCollectionUrl = ({ searchTerm }) => (
  `${API_HOST}/collections/search?q=${searchTerm}`
);

/**
 * Returns the URL for collections.
 *
 * @param {Object} obj - An object.
 * @param {String} [obj.page] - The page number.
 * @param {String} [obj.size] - The number of collections to return.
 * @param {String} [obj.sort] - The sort property.
 * @param {String} [obj.categories] - The categories filter. Ex: categories=utility,music
 * @param {String} obj.chain - The chain where to get the collections from.
 * @returns {String} The collections URL.
 */
 const collectionsUrl = ({ page = 0, size = 50, sort, categories, chain }) => (
  `${API_HOST}/collections?page=${page}&size=${size}&sort=${sort}&chain=${chain}${categories ? `&categories=${categories}` : ''}`
);

/**
 * Returns the URL for getting token snippets of a collection.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.address - The collection address.
 * @param {Number} [obj.size] - The number of tonkens to get.
 * @returns {String} The collection token snippets URL.
 */
 const collectionTokenSnippetsUrl = ({ address, size = 5 }) => (
  `${API_HOST}/collections/${address}/tokens/snippet?size=${size}&fields=name,imageHosted,tokenId,collectionId`
);


/**
 * Returns the URL for searching a token.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.searchTerm - The search term.
 * @returns {String} The token search URL.
 */
 const searchTokenUrl = ({ searchTerm }) => (
  `${API_HOST}/tokens/search?q=${searchTerm}&fields=name,imageHosted,lowestPrice,rarityRank,collectionId,tokenId,price`
);

/**
 * Returns the URL for searching a user.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.searchTerm - The search term.
 * @returns {String} The user search URL.
 */
 const searchUserUrl = ({ searchTerm }) => (
  `${API_HOST}/users/search?q=${searchTerm}`
);

/**
 * Returns the URL for user's data.
 *
 * @param {Object} obj - An object.
 * @param {String} obj.address - The user's address.
 * @param {('activity')} [obj.resourceType] - The resource type name.
 * @returns {String} The user's data URL.
 */
 const userUrl = ({ address, resourceType }) => {
  const resourcePath = resourceType ? `/${resourceType}` : '';
  const url = new URL(`${API_HOST}/users/${address}${resourcePath}`);

  if (resourceType === 'activity') {
    url.searchParams.append('include', ['transfers', 'auctions', 'listings', 'bids', 'sales']);
  }

  return url.toString();
 };

 const offerUrl = ({ address, resourceType }) => {
  
  const url = new URL(`${API_HOST}/users/${address}/offers`);

  if (resourceType === 'tokens') {
    url.searchParams.append('include', ["tokens"]);
  }

  return url.toString();
 };

 /**
 * Returns the URL for uploading files to IPFS.
 *
 * @param {Object} obj - An object.
 * @returns {String} The file upload URL.
 */
  const fileUploadUrl = () => (
    `${API_HOST}/uploads/ipfs`
  );

export {
  collectionUrl,
  nftUrl,
  collectionsUrl,
  collectionTokenSnippetsUrl,
  searchCollectionUrl,
  searchTokenUrl,
  searchUserUrl,
  userUrl,
  offerUrl,
  fileUploadUrl
};