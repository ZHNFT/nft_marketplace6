function getDomain(marketplaceAddress, chainId) {
    
    return {

        name : "HEXAGONMarketplace",
        version : "1",
        chainId : chainId,
        verifyingContract : marketplaceAddress

    }

}

export async function getSignatureListing(listing, signer, ethers, marketplaceAddress, chainId) {

    console.log("get signature listing")

    console.log("chainId = ")

    console.log(chainId)

    console.log("marketplace contract");

    const domain = getDomain(marketplaceAddress, chainId);

    const types = {

        "AcceptListing": [{
            "name": "contractAddress",
            "type": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "name": "userAddress",
                "type": "address"
            },
            {
                "name": "pricePerItem",
                "type": "uint256"
            },
            {
                "name": "quantity",
                "type": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ]
        
    };

    // The data to sign
    const value = {
        contractAddress: listing.contractAddress,
        tokenId : listing.tokenId,
        userAddress : listing.userAddress,
        pricePerItem : listing.pricePerItem,
        quantity : listing.quantity,
        expiry : listing.expiry,
        nonce : listing.nonce
    };

    let signature = await signer._signTypedData(domain, types, value);

    let splitSignature = ethers.utils.splitSignature(signature);

    listing.v = splitSignature.v;
    listing.s = splitSignature.s;
    listing.r = splitSignature.r;

    return { listing, signature };

}

export async function getSignatureOffer(offer, signer, ethers, marketplaceAddress, chainId) {

    const domain = getDomain(marketplaceAddress, chainId)

    const types = {

        "AcceptBid": [{
            "name": "contractAddress",
            "type": "address"
            },
            {
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "name": "userAddress",
                "type": "address"
            },
            {
                "name": "pricePerItem",
                "type": "uint256"
            },
            {
                "name": "quantity",
                "type": "uint256"
            },
            {
                "name": "expiry",
                "type": "uint256"
            },
            {
                "name": "nonce",
                "type": "uint256"
            }
        ]
        
    };

    // The data to sign
    const value = {
        contractAddress: offer.contractAddress,
        tokenId : offer.tokenId,
        userAddress : offer.userAddress,
        pricePerItem : offer.pricePerItem,
        quantity : offer.quantity,
        expiry : offer.expiry,
        nonce : offer.nonce
    };

    let signature = await signer._signTypedData(domain, types, value);

    // const verifiedAddress = ethers.utils.verifyTypedData(
    //     domain,
    //     types,
    //     value,
    //     signature
    // );

    let splitSignature = ethers.utils.splitSignature(signature);

    offer.v = splitSignature.v;
    offer.s = splitSignature.s;
    offer.r = splitSignature.r;

    return { offer, signature };

}



