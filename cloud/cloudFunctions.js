Moralis.Cloud.afterSave("TestTransfers", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    const from = request.object.get("from")

    if (from == "0x0000000000000000000000000000000000000000") {

        //This is from the zero address, so it is minted
        const NFT = Moralis.Object.extend("NFT");
        const nft = new NFT();
        
        let tokenId = request.object.get("tokenId");
        nft.set("tokenId", tokenId);
        
        let contractAddress = request.object.get("address");
        contractAddress = contractAddress.toString();

        
        logger.info("Contract address = ");
        logger.info(contractAddress); 
        nft.set("contractAddress", contractAddress);
        
        const web3 = Moralis.web3ByChain("0x13881"); // Polygon mumbai
        const abi = Moralis.Web3.abis.erc721;

        // create contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);
        
        // get contract name
        const name = await contract.methods.name().call()
        
        const uri = await contract.methods.tokenURI(tokenId).call();
        
        nft.set("contractName", name);
        
        nft.set("uri", uri.toString());
        
        nft.save()

    } else {
        logger.info("not minted");
    }
    
    return request;
    
    
  });


  Moralis.Cloud.afterSave("TestNFTTransferstwo", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    const from = request.object.get("from")

    if (from == "0x0000000000000000000000000000000000000000") {

        //This is from the zero address, so it is minted
        const NFT = Moralis.Object.extend("NFT");
        const nft = new NFT();
        
        let tokenId = request.object.get("tokenId");
        nft.set("tokenId", tokenId);
        
        let contractAddress = request.object.get("address");
        contractAddress = contractAddress.toString();

        
        logger.info("Contract address = ");
        logger.info(contractAddress); 
        nft.set("contractAddress", contractAddress);
        
        const web3 = Moralis.web3ByChain("0x13881"); // Polygon mumbai
        const abi = Moralis.Web3.abis.erc721;

        // create contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);
        
        // get contract name
        const name = await contract.methods.name().call()
        
        const uri = await contract.methods.tokenURI(tokenId).call();
        
        nft.set("contractName", name);
        
        nft.set("uri", uri.toString());
        
        nft.save()

    } else {
        logger.info("not minted");
    }
    
    return request;
    
    
  });

  