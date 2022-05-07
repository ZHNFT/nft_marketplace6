import { sanitizeUrl } from "./helper";

// https://ipfs.io/ipfs/
const resolveLink = (url) => {
  if (!url) return url;
  if (!url.includes("ipfs://")) return sanitizeUrl(url);
  return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
};

const resolveBunnyLink = (url) => {
  if (!url) return url;
  if (!url.includes("ipfs://")) return sanitizeUrl(url);
  return url.replace("ipfs://", "https://hexagon-ipfs.b-cdn.net/");
}

function ellipseAddress(address = '', width = 10) {
  if (!address) {
    return ''
  }
  return `${address.slice(0, width)}...${address.slice(-width)}`
}

export { resolveLink, ellipseAddress, resolveBunnyLink };