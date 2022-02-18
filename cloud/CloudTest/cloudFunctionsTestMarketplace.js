  Moralis.Cloud.define("AddCollection", async (request) => {

    let tableName = request.params.tableName;
    let address = request.params.contractAddress;
    let transferTableName = request.params.transferTableName

    address = address.toString();
    address = address.toLowerCase();
    
    const logger = Moralis.Cloud.getLogger();
    logger.info("address = ");
    logger.info(address);

    let collectionName = request.params.collectionName;

    //This is from the zero address, so it is minted
    const Collection = Moralis.Object.extend("WhitelistedCollection");
    const collection = new Collection();

    collection.set("contractAddress", address);
    collection.set("collectionName", collectionName);
    //set empty traits object that will be filled in
    collection.set("traits", {});

    collection.set("tableName", tableName);

    collection.set("transferTableName", transferTableName);

    //Add the collection to the database
    collection.save({useMasterKey:true});

    //TODO: running this is causing errors

    // // code example of creating a sync event from cloud code
    // let options = {
    //     "chainId": chainId,
    //     "address": address,
    //     "topic": "Transfer(address,address,uint256)",
    //     "abi":  {
    //         "anonymous": false,
    //         "inputs": [
    //           {
    //             "indexed": true,
    //             "internalType": "address",
    //             "name": "from",
    //             "type": "address"
    //           },
    //           {
    //             "indexed": true,
    //             "internalType": "address",
    //             "name": "to",
    //             "type": "address"
    //           },
    //           {
    //             "indexed": true,
    //             "internalType": "uint256",
    //             "name": "tokenId",
    //             "type": "uint256"
    //           }
    //         ],
    //         "name": "Transfer",
    //         "type": "event"
    //       },
    //     "tableName": transferTableName,
    //     "sync_historical": false
    // }

    // //Watch the transfer events for the newly added collection, still have to add the function that gets called when this database changes
    // Moralis.Cloud.run("watchContractEvent", options, {useMasterKey:true});

    
  });

//   Moralis.Cloud.define("unwatchCollection", async (request) => {

//     const logger = Moralis.Cloud.getLogger();


//     let tableName = request.params.tableName;

//     logger.info("unwatching collection: ");
//     logger.info(tableName)

//     let options = {"tableName": tableName}
//     Moralis.Cloud.run("unwatchContractEvent", options, {useMasterKey:true});


//   });

  Moralis.Cloud.beforeSave("AdditionalNFTTransfers", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    const from = request.object.get("from")

    const confirmed = request.object.get("confirmed");

    if(confirmed) {
        
        let contractAddress = request.object.get("address");
        contractAddress = contractAddress.toString();

        contractAddress = contractAddress.toLowerCase();

        let params = {};
        params["contractAddress"] = contractAddress;
        params["from"] = from;
        params["tokenId"] = request.object.get("tokenId");
        params["to"] = request.object.get("to");
        //params["object"] = request.object;

        await Moralis.Cloud.run("HandleTransfer", params);

    } else {
        logger.info("not confirmed");
    }

    return request;

    
  });


  Moralis.Cloud.beforeSave("TestNFTTransfers", async (request) => {

    const logger = Moralis.Cloud.getLogger();
    const from = request.object.get("from")

    const confirmed = request.object.get("confirmed");

    if(confirmed) {
        
        let contractAddress = request.object.get("address");
        contractAddress = contractAddress.toString();

        contractAddress = contractAddress.toLowerCase();

        let params = {};
        params["contractAddress"] = contractAddress;
        params["from"] = from;
        params["tokenId"] = request.object.get("tokenId");
        params["to"] = request.object.get("to");
        //params["object"] = request.object;

        await Moralis.Cloud.run("HandleTransfer", params);

    } else {
        logger.info("not confirmed");
    }

    return request;

    
  });


  Moralis.Cloud.define("HandleTransfer", async (request) => {

    const logger = Moralis.Cloud.getLogger();

    logger.info("HandleTransfers called");

    logger.info("contract address = ");
    logger.info(request.params.contractAddress);

    const tokenId = request.params.tokenId;

    //Get the table name that this nft saved to
    const tableName = collection.get("tableName");

    const NFT = Moralis.Object.extend(tableName + "NFT");
    const nftQuery = new Moralis.Query(NFT);

    query.equalTo("tokenId", tokenId);

    const nftResult = await nftQuery.find();

    //Initialize a new nft if one doesnt exist
    let nft = (nftResult.length == 0) ? new nft() : nftResult[0]; 

    if (request.params.from == "0x0000000000000000000000000000000000000000") {

        //This is from the zero address, so it is minted

       let contractAddress = request.params.contractAddress;

       
       //Grab the collection this is from
       const Collection = Moralis.Object.extend("WhitelistedCollection");

       const lowerCaseCollection = contractAddress.toLowerCase();

       const query = new Moralis.Query(Collection);

       query.equalTo("contractAddress", lowerCaseCollection);

       const collectionResult = await query.find();

       let collection;
       if(collectionResult.length == 1) {
           collection = collectionResult[0];
       } else {
           logger.error("Collection length should be 1");
       }

       
       //Save the nft to the tableName + "NFT", this is where the site will retrieve the data from
       const NFT = Moralis.Object.extend(tableName + "NFT");
       const nft = new NFT();
       
       
       nft.set("tokenId", tokenId);

       tokenId = parseInt(tokenId);
      

       nft.set("contractAddress", contractAddress);
       
       const web3 = Moralis.web3ByChain("0x13881"); // Polygon mumbai
       const abi = [{
        "inputs": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          }
        ],
        "name": "tokenURI",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }]
    

       // create contract instance
       const contract = new web3.eth.Contract(abi, contractAddress);
       
       // get contract name
       //const name = await contract.methods.name().call()
       
       let uri = await contract.methods.tokenURI(tokenId).call();

       logger.info("Uri = ");
       logger.info(uri);

       //TODO: not everything will be using ipfs 
       let hash = uri.split("://")[1]
       uri = `https://ipfs.io/ipfs/${hash}`;

       let traits = collection.get("traits");

       let httpResponse = await Moralis.Cloud.httpRequest({url: uri})
        // success
        //logger.info(httpResponse)
        let data = JSON.parse(httpResponse.text)
        
        let attributesLength = data.attributes.length;

        logger.info(attributesLength)

        for(index in data.attributes) {

            let element = data.attributes[index]
            let property;
            let value;
            for(key in element) {

                logger.info(key);

                if(key == "value") {
                    
                    value = element[key];
                } else if(key == "trait_type") {
                    
                    property = element[key]; 
                } else {
                    logger.info("key is not either");
                }
                //logger.info(element[key])

            }

            if(traits.hasOwnProperty(property)) {

                //This property has been set
                if(traits[property].hasOwnProperty(value)) {
                    //this value has been set
                    traits[property][value] += 1;

                } else {
                    traits[property][value] = 1;
                }

            } else {
                traits[property] = {}
                traits[property][value] = 1
            }

            nft.set(property.toString(), value.toString());

        }

        logger.info(data.image);

        logger.info("after traits, now saving collection");
        
        //set the traits
        collection.set("traits", traits);

        //increment the total
        collection.increment("total");

        //save the collection
        collection.save();

        nft.set("traits", traits);
        nft.set("uri", uri.toString());
          
   } else {
       logger.info("not minted");
   }
   //set the owner to be the address the nft was sent to
   nft.set("owner", request.params.to);

   //save the nft
   nft.save();
   
   return request;

  });

  