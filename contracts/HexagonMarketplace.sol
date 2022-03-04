// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/interfaces/IERC165.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HexagonMarketplace is Ownable, ReentrancyGuard {
    
    using SafeERC20 for IERC20;

    /**
    * @dev Interface ids to check which interface a nft contract supports, used to classify between an ERC721 and ERC1155 nft contracts
    */
    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant INTERFACE_ID_ERC1155 = 0xd9b67a26;

    /**
    * @dev The divisor when calculating percent fees
    */
    uint constant BASIS_POINTS = 10000;

    /**
    * @dev This is the max percent fee that can be charged for using a token (10% max)
    */
    uint constant MAX_FEE = 1000;


    /**
    * @dev Struct containing contract address and fees for a payment token
    */
    struct PaymentToken {

        address contractAddress;
        uint fee;
    }

    /**
    * @dev Addresses of the payment tokens this marketplace accepts
    */
    PaymentToken[] paymentTokens;


    /**
    * @dev amount of fees that can be pulled from the contract and sent into the other wallets in the protocal
    */
    mapping(uint => uint) claimableAmount;

    struct FeeAllocation {
        address wallet;
        uint percent;
    }

    FeeAllocation[] feeAllocations;

    /**
    * @dev A Struct containing all the payment info for a whitelisted collection.
    */
    struct Collection {
        address royaltyRecipient;
        uint royaltyFee;
        uint royaltiesEarned;
        uint currencyType;
    }

    /**
    * @dev A Struct containing all the info for a nft listing or bid, this data is also used to generate a signature that checked to see if the owner of the nft signed it,
    * authorizing the sale of the nft with these parameters if a buyer accepts.
    */
    struct Signature {
        address contractAddress;
        address userAddress;
        uint256 tokenId;
        uint256 quantity;
        uint256 pricePerItem;
        uint256 expiry;
        uint256 nonce;
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    /**
    * @dev Struct containing data about the highest bid for a particular nft
    */ 
    struct AuctionData {
        uint tokenId;
        uint highestBid;
        uint expiry;
        uint minBid;
        uint percentIncrement;
        uint quantity;
        address highestBidder;
        address collectionAddress;

    }

    /**
    * @dev mapping from collection id -> tokenId -> owner -> auctionData
    * ///@notice owner is used as a mapping because multiple owners can put of for auction the same erc1155 item
    */
    mapping(address => mapping(uint => mapping(address => AuctionData))) public AuctionMapping;

    /**
    * @dev A mapping of nft collection addresses of whitelisted collection, and the data corrisponding to it (royalty fee, wallet address)
    */
    mapping(address => Collection) whitelistedCollections;

    /**
    * @dev A mapping of signatures and their validity. Signatures are signed messages from people offering bids on nfts they want to buy,
    * or setting a listing price on an nft they wish to sell. After a trade goes through, or a listing/bid is canceled, the signature is mapped here to be invalid. 
    */
    mapping(bytes32 => bool) invalidSignatures;

    /**
    * @dev Event emitted when the percent fee the marketplace takes changes
    */
    event UpdateFee(uint fee);

    /**
    * @dev Event emitted when the wallet address that marketplace fees get sent to changes
    */
    event UpdateFeeRecipient(address feeRecipient);

    /**
    * @dev Event emitted when a collection gets get added to the marketplace, allowing this contracts nfts to be traded on this marketplace
    */
    event CollectionWhitelisted(address nftAddress, address royaltyRecipient, uint royaltyFee);

    /**
    * @dev Event emitted when a collection gets removed from the marketplace, meaning the contracts nfts can no longer trade on this marketplace
    */
    event CollectionRemoved(address nftAddress);

    /**
    * @dev Event emitted when a collection gets updated, either its royalty fees, or its wallet address
    */
    event CollectionUpdated(address nftAddress, address royaltyRecipient, uint royaltyFee);

    /**
    * @dev Event emitted when a bid is accepted by the owner of the nft, and a trade takes place
    */
    event BidAccepted(
        address indexed nftContract,
        uint256 indexed tokenId,
        address indexed seller,
        address buyer,
        uint256 marketplaceFee,
        uint256 creatorFee,
        uint256 ownerRevenue,
        uint256 value
    );

    /**
    * @dev Event emitted when a bid is canceled
    */
    event BidCanceled(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        address indexed bidder,
        uint nonce
    );

    /**
    * @dev Event emitted when a listing is accepted by the buyer and a trade takes place
    */
    event ListingAccepted(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        address indexed owner,
        address buyer,
        uint256 marketplaceFee,
        uint256 creatorFee,
        uint256 ownerRevenue,
        uint256 value
    );

    /**
    * @dev Event emitted when a listing is canceled
    */
    event ListingCanceled(
        address indexed nftContractAddress,
        uint256 indexed tokenId,
        address indexed owner,
        uint nonce
    );

    /**
    * @dev Event emitted when an auction is placed for an nft
    */
    event AuctionBid(address indexed collectionAddress, uint indexed tokenId, address indexed bidder, uint bid);

    /**
    * @dev Event emitted when an auction is placed for an nft
    */
    event AuctionPlaced(address indexed collectionAddress, uint indexed tokenId);

    /**
    * @dev Event emitted when an auction is concluded
    */
    event AuctionConcluded(address indexed collectionAddress, uint indexed tokenId, address indexed bidder, uint bid);

     /**
    * @dev This is the domain used in EIP-712 signatures.
    * It is not a constant so that the chainId can be determined dynamically.
    * If multiple classes use EIP-712 signatures in the future this can move to a shared file.
    */
    bytes32 private DOMAIN_SEPARATOR;

    /**
    * @dev This name is used in the EIP-712 domain.
    * If multiple classes use EIP-712 signatures in the future this can move to the shared constants file.
    */
    string private constant NAME = "HEXAGONMarketplace";

    /**
    * @dev This is a hash of the method signature used in the EIP-712 signature for bids.
    */
    bytes32 private constant ACCEPT_BID_TYPEHASH =
        keccak256("AcceptBid(address contractAddress,uint256 tokenId,address userAddress,uint256 pricePerItem,uint256 quantity,uint256 expiry,uint256 nonce)");

     /**
    * @dev This is a hash of the method signature used in the EIP-712 signature for listings.
    */
    bytes32 private constant ACCEPT_LISTING_TYPEHASH =
        keccak256("AcceptListing(address contractAddress,uint256 tokenId,address userAddress,uint256 pricePerItem,uint256 quantity,uint256 expiry,uint256 nonce)");

    /**
    * @dev This function must be called at least once before signatures will work as expected.
    * It's okay to call this function many times. Subsequent calls will have no impact.
    */
    function _initializeSignatures() internal {
        uint256 chainId;
        // solhint-disable-next-line no-inline-assembly
        assembly {
        chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(NAME)),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function getChainId() public view returns(uint256) {
        uint256 chainId;
        // solhint-disable-next-line no-inline-assembly
        assembly {
        chainId := chainid()
        }

        return chainId;
    }

    /**
    * @dev Modifier ensuring the provided contract address has been whitelisted
    */
    modifier onlyWhitelisted(address nft) {
        require(whitelistedCollections[nft].royaltyFee > 0, "nft not whitelisted");
        _;
    }

    /**
    * @dev Constructor initializing the fees, recipient of market fees, and the contract address of the payment token used in this marketplace
    */
    constructor() {
        _initializeSignatures();
    }

    /**
    * @notice Allow a buyer to purchase the nfts at the price previously set.
    * @dev The seller signs a message approving the price, and then the buyer calls this function
    * and transfers the agreed upon tokens
    */
    function AcceptListing(Signature calldata listing) public nonReentrant onlyWhitelisted(listing.contractAddress) {

        bytes32 signature = getSignature(ACCEPT_LISTING_TYPEHASH, listing);

        // Revert if the signature is invalid, the terms are not as expected, or if the seller transferred the NFT.
        require(ecrecover(signature, listing.v, listing.r, listing.s) == listing.userAddress && invalidSignatures[signature] == false, "AcceptListing: Invalid Signature");

        //Invalidate signature so it cannot be used again
        invalidSignatures[signature] = true;
        
        // The signed message from the seller is only valid for a limited time.
        require(listing.expiry > block.timestamp, "AcceptListing: EXPIRED");

        // Transfer the nft(s) from the owner to the bidder
        // Will revert if the seller doesn't have the nfts
        if (IERC165(listing.contractAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721(listing.contractAddress).safeTransferFrom(listing.userAddress, msg.sender, listing.tokenId);
        } else {
            IERC1155(listing.contractAddress).safeTransferFrom(listing.userAddress, msg.sender, listing.tokenId, listing.quantity, bytes(""));
        }

        uint256 value = listing.pricePerItem * listing.quantity;

        // Pay the creator the marketplace, and seller
        // Will revert if the buyer doesn't have the funds
        (uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue) = _distributeFunds(
            value,
            listing.userAddress,
            msg.sender,
            listing.contractAddress
        );

        emit ListingAccepted(
            listing.contractAddress,
            listing.tokenId,
            listing.userAddress,
            msg.sender,
            marketplaceFee,
            creatorFee,
            ownerRevenue,
            value
        );
    }

    /**
    * @dev The seller cancels the listing they previously approved by providing the listing data they wish to cancel
    */
    function CancelListing(Signature calldata listing) public {

        bytes32 signature = getSignature(ACCEPT_LISTING_TYPEHASH, listing);

        // Revert if the signature has not been signed by the sender
        require(ecrecover(signature, listing.v, listing.r, listing.s) == msg.sender, "CancelBid: INVALID_SIGNATURE");

        //Set the signature to be invalid, preventing anyone from using this signature to purchase this item
        invalidSignatures[signature] = true;

        emit ListingCanceled(
            listing.contractAddress,
            listing.tokenId,
            msg.sender,
            listing.nonce
        );

    }

    /**
    * @notice Allow a bid for a NFT to be accepted by the owner.
    * @dev The buyer signs a message approving the purchase, and then the seller calls this function
    * with the msg.value equal to the agreed upon price.
    */
    function AcceptBid (Signature calldata bid) public nonReentrant onlyWhitelisted(bid.contractAddress) {

        bytes32 signature = getSignature(ACCEPT_BID_TYPEHASH, bid);

        // Revert if the signature is invalid, the terms are not as expected, or if the seller transferred the NFT.
        require(ecrecover(signature, bid.v, bid.r, bid.s) == bid.userAddress && invalidSignatures[signature] == false, "AcceptBid: Invalid Signature");

        //Invalidate signature so it cannot be used again
        invalidSignatures[signature] = true;
        
        // The signed message from the seller is only valid for a limited time.
        require(bid.expiry > block.timestamp, "AcceptBid: EXPIRED");


        //Transfer the nft from the owner to the bidder
        if (IERC165(bid.contractAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721(bid.contractAddress).safeTransferFrom(msg.sender, bid.userAddress, bid.tokenId);
        } else {
            IERC1155(bid.contractAddress).safeTransferFrom(msg.sender, bid.userAddress, bid.tokenId, bid.quantity, bytes(""));
        }

        uint256 value = bid.pricePerItem * bid.quantity;

        // Pay the creator the marketplace, and seller
        // Will revert of the bidder doesn't have the funds
        (uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue) = _distributeFunds(
            value,
            msg.sender,
            bid.userAddress,
            bid.contractAddress
        );

        emit BidAccepted(
            bid.contractAddress,
            bid.tokenId,
            msg.sender,
            bid.userAddress,
            marketplaceFee,
            creatorFee,
            ownerRevenue,
            value
        );
    }

    /**
    * @dev The buyer cancels the bid they previously approved by providing the bid data they wish to cancel
    */
    function CancelBid(Signature calldata bid) public {

        bytes32 signature = getSignature(ACCEPT_BID_TYPEHASH, bid);

        // Revert if the signature has not been signed by the sender
        require(ecrecover(signature, bid.v, bid.r, bid.s) == msg.sender, "CancelBid: INVALID_SIGNATURE");

        //Invalidate signature so it can no longer be used
        invalidSignatures[signature] = true;

        emit BidCanceled(
            bid.contractAddress,
            bid.tokenId,
            msg.sender,
            bid.nonce
        );
    }

    /**
    * @dev Destributes the funds from the buyer to the seller/owner, with a percentage of the sale price distributed to the marketplace,
    * and potentially the creator of the collection
    */
    function _distributeFunds(
        uint256 _value,
        address _owner,
        address _sender,
        address _nftAddress
       
    ) internal returns(uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue){

        if(_value > 0) {

            Collection memory collection = whitelistedCollections[_nftAddress];

            PaymentToken memory paymentToken = paymentTokens[collection.currencyType];

            IERC20 token = IERC20(paymentToken.contractAddress);

            //calculate fee for the marketplace
            marketplaceFee = _value * paymentToken.fee / BASIS_POINTS;

            //calculate the creator fee
            creatorFee = _value * collection.royaltyFee / BASIS_POINTS;


            if(marketplaceFee > 0) {

                ///@notice buyer can be 
                if(_sender != address(this)) {

                    //send tokens to the marketplace wallet
                    token.safeTransferFrom(_sender, address(this), marketplaceFee);

                }

                claimableAmount[collection.currencyType] += marketplaceFee;

            }

            if(creatorFee > 0) {

                whitelistedCollections[_nftAddress].royaltiesEarned += creatorFee;
                
                //send tokens to the creator wallet
                token.safeTransferFrom(_sender, collection.royaltyRecipient, creatorFee);

               

            }

            ownerRevenue = (_value - marketplaceFee) - creatorFee;

            //send remaining tokens to the seller/owner
            token.safeTransferFrom(_sender, _owner, ownerRevenue);

        }
    }
    

    /**
    * @dev Place a bid an nft up for auction
    * requires the auction to have started and not be over
    * and the value of the bid to be at least the minimum bid amount, greator than the current highest bid, and increased from the min bid
    * by at least the minimum increment
    * @notice Payment tokens are sent to the contract on successful bid, and if a bid is beaten the tokens they sent will be sent back to the beaten bids address
    */
    function placeAuctionBid(address _collectionAddress, uint _tokenId, address _owner, uint _amount) public nonReentrant
    {
        
        AuctionData memory auctionData = AuctionMapping[_collectionAddress][_tokenId][_owner];

        require(auctionData.quantity > 0, "Auction doesn't exist");

        require(auctionData.expiry > block.timestamp, "Auction is over");

        require(msg.sender != _owner, "Can't bid on your own item");

        uint highestBid = auctionData.highestBid;
        address highestBidder = auctionData.highestBidder;

        ///@notice set the values here to help prevent reentancy attack
        auctionData.highestBidder = msg.sender;
        auctionData.highestBid = _amount;

        AuctionMapping[_collectionAddress][_tokenId][_owner] = auctionData;

        Collection memory collection = whitelistedCollections[_collectionAddress];

        PaymentToken memory paymentToken = paymentTokens[collection.currencyType];

        IERC20 token = IERC20(paymentToken.contractAddress);

        if(highestBid > 0) {

            uint minIncrement = (highestBid * auctionData.percentIncrement) / 1000;

            ///@notice there is already a bid on this auction, so it needs to be higher
            require(_amount >= highestBid + minIncrement, "Amount needs to be more than last bid, plus increment");

            ///@notice the _amount is more, so lets send the other funds back
            token.safeTransfer(highestBidder, highestBid);


        } else {

            ///@notice there is already a bid on this auction, so it needs to be higher
            require(_amount >= auctionData.minBid, "Amount needs to be more than the min bid");

        }

        ///@notice send the tokens to the contract to be locked until either outbid, or the auction is over
        token.safeTransferFrom(msg.sender, address(this), _amount);




        emit AuctionBid(_collectionAddress, _tokenId, msg.sender, _amount);


    }

    /**
    * @dev Place an auction, setting the auctions parameters and locking the nft in the contract until the auction is concluded
    * Requires an auction to not already exist, and the proper permissions to be set
    */
    function placeAuction(AuctionData memory _auctionData) public onlyWhitelisted(_auctionData.collectionAddress) nonReentrant {

        require(_auctionData.expiry > block.timestamp, "Auction needs to have a duration");

        require(AuctionMapping[_auctionData.collectionAddress][_auctionData.tokenId][msg.sender].quantity == 0, "Auction already exists");

        require(_auctionData.percentIncrement >= 50, "need to set a minimum percent of at least 5");

        require(_auctionData.minBid > 0, "have to set a minimum bid");

        AuctionMapping[_auctionData.collectionAddress][_auctionData.tokenId][msg.sender] = _auctionData;

        //Hold the nft in escrow
        ///@notice assumption is made that these contracts will be either erc721 or erc1155, because those are the only contracts thats will be whitelisted
        /// this will also revert if permissions havent been set, or the sender doesnt own the nft
        if (IERC165(_auctionData.collectionAddress).supportsInterface(INTERFACE_ID_ERC721)) {

            IERC721(_auctionData.collectionAddress).transferFrom(msg.sender, address(this), _auctionData.tokenId);
            require(_auctionData.quantity == 1, "Can't have more than 1 nft of this type");

            
        } else {
            
            IERC1155(_auctionData.collectionAddress).safeTransferFrom(msg.sender, address(this), _auctionData.tokenId, _auctionData.quantity, bytes(""));

            require(_auctionData.quantity > 0, "Quantity can't be zero");
        }

        
        emit AuctionPlaced(_auctionData.collectionAddress, _auctionData.tokenId);

    }

    /**
    * @dev Completes an auction, sending funds and the nft to the proper owners
    * Requires the auction to be over, can be called by anyone
    */
    function concludeAuction(address _collectionAddress, uint _tokenId, address _owner) public nonReentrant {

        AuctionData memory auctionData = AuctionMapping[_collectionAddress][_tokenId][_owner];

        require(auctionData.quantity > 0, "Auction doesn't exist");

        require(auctionData.expiry >= block.timestamp, "Auction isn't over");

        address nftReciever;

        if(auctionData.highestBid > 0) {

            ///@notice there was a bid, so we can send the funds from this contract to the appropriate people, and send the nft to the bidder
            nftReciever = auctionData.highestBidder;

            //send funds from this address
            _distributeFunds(auctionData.highestBid, _owner, address(this), auctionData.collectionAddress);

        } else {

            ///@notice there wasnt a bid, so the nft can be sent back to the owner
            nftReciever = _owner;

        }

        //Send the nft from this contract to the proper person
        ///@notice assumption is made that these contracts will be either erc721 or erc1155, because those are the only contracts thats will be whitelisted
        /// this will also revert if permissions havent been set, or the sender doesnt own the nft
        if (IERC165(auctionData.collectionAddress).supportsInterface(INTERFACE_ID_ERC721)) {

            IERC721(auctionData.collectionAddress).safeTransferFrom(address(this), nftReciever, auctionData.tokenId);

            
        } else {
            
            IERC1155(auctionData.collectionAddress).safeTransferFrom(address(this), nftReciever, auctionData.tokenId, auctionData.quantity, bytes(""));

        }

        ///@notice delete the auction so a new one can be made
        delete AuctionMapping[_collectionAddress][_tokenId][_owner];

        emit AuctionConcluded(_collectionAddress, _tokenId, nftReciever, auctionData.highestBid);


    }

   

    //View functions

    function getTimestamp() public view returns(uint) {
        return block.timestamp;
    }

    function getSignature(bytes32 _TYPEHASH, Signature memory signature) internal view returns(bytes32) {

        return keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(_TYPEHASH, signature.contractAddress, signature.tokenId, signature.userAddress, signature.pricePerItem, signature.quantity, signature.expiry, signature.nonce))
            )
        );

    }

    function getCollectionInfo(address _collectionAddress) public view returns (Collection memory) {
        return whitelistedCollections[_collectionAddress];
    }

    /**
    * @dev Retrieves the total royalties this collection has generated
    */
    function getRoyaltiesGenerated(address _collectionAddress) public view returns (uint) {

        return whitelistedCollections[_collectionAddress].royaltiesEarned;

    }

    //Owner functions

    /**
    * @dev Claims the fees generated by the marketplace, if any, and sends to the proper wallets in the set amounts
    */
    function claimFees() external onlyOwner {

        FeeAllocation[] memory _feeAllocations = feeAllocations;

        require(_feeAllocations.length > 0, "Fee allocations not set");

        PaymentToken[] memory tokens = paymentTokens;

        require(tokens.length > 0, "No tokens set");

        for(uint i = 0; i < tokens.length; i++) {

            IERC20 token = IERC20(tokens[i].contractAddress);

            uint _claimableAmount = claimableAmount[i];

            if(_claimableAmount == 0) {
                continue;
            }

            for(uint j = 0; j < _feeAllocations.length; j++) {

                uint toClaim = (_claimableAmount * _feeAllocations[i].percent) / BASIS_POINTS;

                if(toClaim > 0) {

                    token.safeTransfer(_feeAllocations[i].wallet, toClaim);

                }

            }

            claimableAmount[i] = 0;

        }

    }

    function setPaymentToken(address _paymentAddress, uint256 _fee, uint256 _index) external onlyOwner {

        require(_index <= paymentTokens.length, "index out of range");
        require(_fee <= MAX_FEE, "Attempting to set too high of a fee");

        //approve this contract to use transfer from to move funds
        IERC20(_paymentAddress).approve(address(this), 2**256 - 1);

        if(_index == paymentTokens.length) {

            //Adding a new payment token
            paymentTokens.push(PaymentToken(_paymentAddress, _fee));

        } else {

            //Updating a previous payment token
            paymentTokens[_index] = PaymentToken(_paymentAddress, _fee);

        }

    }

    /**
    * @dev Sets how the fees will be allocated when withdrawn
    */
    function setFeeAllocations(FeeAllocation[] memory _feeAllocations) public onlyOwner {

        uint totalPercent;

        uint allocationsLength = feeAllocations.length;

        for(uint i = 0; i < _feeAllocations.length; i++) {

            totalPercent += _feeAllocations[i].percent;

            if(i >= allocationsLength) {
                feeAllocations.push(_feeAllocations[i]);
            }else {
                feeAllocations[i] = _feeAllocations[i];
            }
           

        }

        require(totalPercent == BASIS_POINTS, "Total percent does not add to 100%");

    }


    /**
    * @dev Adds a nft collection to the whitelist, allowing it to be traded on this marketplace, and setting the royalty fee and fee recipient
    */
    function addToWhitelist(address _nft, address _royaltyRecipient, uint _royaltyFee, uint _currencyType) external onlyOwner {
        require(whitelistedCollections[_nft].royaltyFee == 0, "nft already whitelisted");
        require(_currencyType < paymentTokens.length, "payment token doesn't exist");
        whitelistedCollections[_nft] = Collection(_royaltyRecipient, _royaltyFee, 0, _currencyType);
        emit CollectionWhitelisted(_nft, _royaltyRecipient, _royaltyFee);
    }

    /**
    * @dev removes a nft collection to the whitelist, preventing from being traded on this marketplace
    */
    function removeFromWhitelist(address _nft) external onlyOwner onlyWhitelisted(_nft) {
        delete whitelistedCollections[_nft];
        emit CollectionRemoved(_nft);
    }

    /**
    * @dev updates a nft collections royalty fee and recepient address
    */
    function updateWhitelist(address _nftAddress, address _royaltyRecipient, uint _royaltyFee) external onlyOwner onlyWhitelisted(_nftAddress) {

        Collection storage _collection = whitelistedCollections[_nftAddress];

        _collection.royaltyFee = _royaltyFee;
        _collection.royaltyRecipient = _royaltyRecipient;

        emit CollectionUpdated(_nftAddress, _royaltyRecipient, _royaltyFee);

    }
}