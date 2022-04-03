const API_HOST = 'https://hexagon-api.onrender.com';

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

export {
  collectionUrl,
  nftUrl,
  searchCollectionUrl,
  userUrl,
  offerUrl
};