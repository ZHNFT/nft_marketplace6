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

export {
  collectionUrl,
  nftUrl,
  searchCollectionUrl
};