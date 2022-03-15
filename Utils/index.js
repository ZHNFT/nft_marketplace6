// https://ipfs.io/ipfs/
const resolveLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

const resolveBunnyLink = (url) => {
  if (!url || !url.includes("ipfs://")) return url;
  return url.replace("ipfs://", "https://hexagon-ipfs.b-cdn.net/");
}

function ellipseAddress(address = '', width = 10) {
  if (!address) {
    return ''
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export { resolveLink, ellipseAddress, resolveBunnyLink };