// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/interfaces/IERC165.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HiveMarketplaceV2 is Ownable, ReentrancyGuard {
    
    using SafeERC20 for IERC20;

    /**
    * @dev Interface ids to check which interface a nft contract supports, used to classify between an ERC721 and ERC1155 nft contracts
    */
    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant INTERFACE_ID_ERC1155 = 0xd9b67a26;

    /**
    * @dev The divisor when calculating percent fees
    */
    uint public constant BASIS_POINTS = 10000;

    /**
    * @dev the address of the payment ERC20 token used to purchase nfts on this market
    */
    address public paymentToken;

    /**
    * @dev The percent fee the market takes for each sale made
    */
    uint256 public fee;

    /**
    * @dev The wallet address the marketplace fees get sent to
    */
    address public feeReceipient;

    /**
    * @dev A Struct containing all the payment info for a whitelisted collection.
    */
    struct Collection {
        address royaltyRecipient;
        uint royaltyFee;
    }

    /**
    * @dev A Struct containing all the info for a nft listing, this data is also used to generate a signature that checked to see if the owner of the nft signed it,
    * authorizing the sale of the nft with these parameters if a buyer accepts.
    */
    struct Listing {
        address nftContractAddress;
        address owner;
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
    * @dev A Struct containing all the info for a nft bid/offer, this data is also used to generate a signature that checked to see if the buyer of the nft signed it,
    * authorizing the purchase of this nft with the given parameters if the owner accepts the offer
    */
    struct Bid {
        address nftContractAddress;
        address bidder;
        uint tokenId;
        uint quantity;
        uint pricePerItem;
        uint expiry;
        uint nonce;
        bytes32 r;
        bytes32 s;
        uint8 v;
    }

    /**
    * @dev A mapping of nft collection addresses of whitelisted collection, and the data corrisponding to it (royalty fee, wallet address)
    */
    mapping(address => Collection) public whitelistedCollections;

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
    * @dev Event emitted when the payment token that is used to purchase nfts is changed
    */
    event UpdatePaymentToken(address paymentToken);

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
    * @dev This is the domain used in EIP-712 signatures.
    * It is not a constant so that the chainId can be determined dynamically.
    * If multiple classes use EIP-712 signatures in the future this can move to a shared file.
    */
    bytes32 private DOMAIN_SEPARATOR;

    /**
    * @dev This name is used in the EIP-712 domain.
    * If multiple classes use EIP-712 signatures in the future this can move to the shared constants file.
    */
    string private constant NAME = "HIVENFTMarketplace";

    /**
    * @dev This is a hash of the method signature used in the EIP-712 signature for bids.
    */
    bytes32 private constant ACCEPT_BID_TYPEHASH =
        keccak256("AcceptBid(address nftContractAddress,uint256 tokenId,address bidder,uint256 pricePerItem,uint256 quantity,uint256 expiry,uint256 nonce)");

     /**
    * @dev This is a hash of the method signature used in the EIP-712 signature for listings.
    */
    bytes32 private constant ACCEPT_LISTING_TYPEHASH =
        keccak256("AcceptListing(address nftContractAddress,uint256 tokenId,address owner,uint256 pricePerItem,uint256 quantity,uint256 expiry,uint256 nonce)");

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
    constructor(uint256 _fee, address _feeRecipient, address _paymentToken) {
        setFee(_fee);
        setFeeRecipient(_feeRecipient);
        setPaymentToken(_paymentToken);
        _initializeSignatures();
    }

    /**
    * @notice Allow a buyer to purchase the nfts at the price previously set.
    * @dev The seller signs a message approving the price, and then the buyer calls this function
    * and transfers the agreed upon tokens
    */
    function AcceptListing(Listing calldata listing) public nonReentrant onlyWhitelisted(listing.nftContractAddress) {

        bytes32 signature = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(ACCEPT_LISTING_TYPEHASH, listing.nftContractAddress, listing.tokenId, listing.owner, listing.pricePerItem, listing.quantity, listing.expiry, listing.nonce))
        )
        );

        // Revert if the signature is invalid, the terms are not as expected, or if the seller transferred the NFT.
        require(ecrecover(signature, listing.v, listing.r, listing.s) == listing.owner && invalidSignatures[signature] == false, "AcceptListing: Invalid Signature");

        //Invalidate signature so it cannot be used again
        invalidSignatures[signature] = true;
        
        // The signed message from the seller is only valid for a limited time.
        require(listing.expiry > block.timestamp, "AcceptListing: EXPIRED");

        // Transfer the nft(s) from the owner to the bidder
        // Will revert if the seller doesn't have the nfts
        if (IERC165(listing.nftContractAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721(listing.nftContractAddress).safeTransferFrom(listing.owner, msg.sender, listing.tokenId);
        } else {
            IERC1155(listing.nftContractAddress).safeTransferFrom(listing.owner, msg.sender, listing.tokenId, listing.quantity, bytes(""));
        }

        uint256 value = listing.pricePerItem * listing.quantity;

        // Pay the creator the marketplace, and seller
        // Will revert if the buyer doesn't have the funds
        (uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue) = _distributeFunds(
            value,
            listing.owner,
            msg.sender,
            listing.nftContractAddress
        );

        emit ListingAccepted(
            listing.nftContractAddress,
            listing.tokenId,
            listing.owner,
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
    function CancelListing(Listing calldata listing) public {

        /// @notice nonce is used so there may be multiple of the same requests, like for purchasing bunches of erc1155 tokens
        bytes32 signature = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(ACCEPT_BID_TYPEHASH, listing.nftContractAddress, listing.tokenId, msg.sender, listing.pricePerItem, listing.quantity, listing.expiry, listing.nonce))
        )
        );

        // Revert if the signature has not been signed by the sender
        require(ecrecover(signature, listing.v, listing.r, listing.s) == msg.sender, "CancelBid: INVALID_SIGNATURE");

        //Set the signature to be invalid, preventing anyone from using this signature to purchase this item
        invalidSignatures[signature] = true;

        emit ListingCanceled(
            listing.nftContractAddress,
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
    function AcceptBid (Bid calldata bid) public nonReentrant onlyWhitelisted(bid.nftContractAddress) {

        bytes32 signature = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(ACCEPT_BID_TYPEHASH, bid.nftContractAddress, bid.tokenId, bid.bidder, bid.pricePerItem, bid.quantity, bid.expiry, bid.nonce))
        )
        );

        // Revert if the signature is invalid, the terms are not as expected, or if the seller transferred the NFT.
        require(ecrecover(signature, bid.v, bid.r, bid.s) == bid.bidder && invalidSignatures[signature] == false, "AcceptBid: Invalid Signature");

        //Invalidate signature so it cannot be used again
        invalidSignatures[signature] = true;
        
        // The signed message from the seller is only valid for a limited time.
        require(bid.expiry > block.timestamp, "AcceptBid: EXPIRED");


        //Transfer the nft from the owner to the bidder
        if (IERC165(bid.nftContractAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721(bid.nftContractAddress).safeTransferFrom(msg.sender, bid.bidder, bid.tokenId);
        } else {
            IERC1155(bid.nftContractAddress).safeTransferFrom(msg.sender, bid.bidder, bid.tokenId, bid.quantity, bytes(""));
        }

        uint256 value = bid.pricePerItem * bid.quantity;

        // Pay the creator the marketplace, and seller
        // Will revert of the bidder doesn't have the funds
        (uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue) = _distributeFunds(
            value,
            msg.sender,
            bid.bidder,
            bid.nftContractAddress
        );

        emit BidAccepted(
            bid.nftContractAddress,
            bid.tokenId,
            msg.sender,
            bid.bidder,
            marketplaceFee,
            creatorFee,
            ownerRevenue,
            value
        );
    }

    /**
    * @dev The buyer cancels the bid they previously approved by providing the bid data they wish to cancel
    */
    function CancelBid(Bid calldata bid) public {

        /// @notice nonce is used so there may be multiple of the same requests, like for purchasing bunches of erc1155 tokens
        bytes32 signature = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(ACCEPT_BID_TYPEHASH, bid.nftContractAddress, bid.tokenId, msg.sender, bid.pricePerItem, bid.quantity, bid.expiry, bid.nonce))
            )
        );

        // Revert if the signature has not been signed by the sender
        require(ecrecover(signature, bid.v, bid.r, bid.s) == msg.sender, "CancelBid: INVALID_SIGNATURE");

        //Invalidate signature so it can no longer be used
        invalidSignatures[signature] = true;

        emit BidCanceled(
            bid.nftContractAddress,
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
        address _buyer,
        address _nftAddress
       
    ) internal returns(uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue){

        if(_value > 0) {

            //calculate fee for the marketplace
            marketplaceFee = _value * fee / BASIS_POINTS;

            Collection memory collection = whitelistedCollections[_nftAddress];

            //calculate the creator fee
            creatorFee = _value * collection.royaltyFee / BASIS_POINTS;

            //send tokens to the marketplace wallet
            IERC20(paymentToken).safeTransferFrom(_buyer, feeReceipient, marketplaceFee);

            if(creatorFee > 0) {
                
                //send tokens to the creator wallet
                IERC20(paymentToken).safeTransferFrom(_buyer, collection.royaltyRecipient, creatorFee);

            }

            ownerRevenue = (_value - marketplaceFee) - creatorFee;

            //send remaining tokens to the seller/owner
            IERC20(paymentToken).safeTransferFrom(_buyer, _owner, ownerRevenue);

        }
    }

    /**
    * @dev Checks if a bid is valid by checking the payment token balance, expiry date, and validates the signature was signed by the bidder
    */
    function ValidBid(Bid calldata bid) public view returns (bool) {

        bytes32 signature = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(ACCEPT_BID_TYPEHASH, bid.nftContractAddress, bid.tokenId, bid.bidder, bid.pricePerItem, bid.quantity, bid.expiry, bid.nonce))
            )
        );

        uint balance = IERC20(paymentToken).balanceOf(bid.bidder);

        // Return if a valid signature, and bidder has enough of a token balance to make the trade if accepted, and not expired
        return (ecrecover(signature, bid.v, bid.r, bid.s) == bid.bidder && invalidSignatures[signature] == false && balance >= bid.quantity * bid.pricePerItem && bid.expiry > block.timestamp);

    }

    /**
    * @dev Checks if a listing is valid by checking the expiry date, nft balance, and validates the signature was signed by the bidder
    */
    function ValidListing(Listing calldata listing) public view returns (bool) {

        bytes32 signature = keccak256(
        abi.encodePacked(
            "\x19\x01",
            DOMAIN_SEPARATOR,
            keccak256(abi.encode(ACCEPT_LISTING_TYPEHASH, listing.nftContractAddress, listing.tokenId, listing.owner, listing.pricePerItem, listing.quantity, listing.expiry, listing.nonce))
            )
        );

        //Check if the owner has the nft
        if (IERC165(listing.nftContractAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            if(IERC721(listing.nftContractAddress).ownerOf(listing.tokenId) != listing.owner){
                return false;
            }
        } else {
            if(IERC1155(listing.nftContractAddress).balanceOf(listing.owner, listing.tokenId) < listing.quantity) {
                return false;
            }
        }

        //Return if a valid signature and not expired
        return ((ecrecover(signature, listing.v, listing.r, listing.s) == listing.owner) && (invalidSignatures[signature] == false) && (listing.expiry > block.timestamp));

    }

    function getTimestamp() public view returns(uint) {
        return block.timestamp;
    }

    //Owner functions

    function setFee(uint256 _fee) public onlyOwner {
        require(_fee < BASIS_POINTS, "max fee");
        fee = _fee;
        emit UpdateFee(_fee);
    }

    function setFeeRecipient(address _feeRecipient) public onlyOwner {
        feeReceipient = _feeRecipient;
        emit UpdateFeeRecipient(_feeRecipient);
    }

    function setPaymentToken(address _paymentToken) public onlyOwner {
        paymentToken = _paymentToken;
        emit UpdatePaymentToken(_paymentToken);
    }

    function addToWhitelist(address _nft, address _royaltyRecipient, uint _royaltyFee) external onlyOwner {
        require(whitelistedCollections[_nft].royaltyFee == 0, "nft already whitelisted");
        whitelistedCollections[_nft] = Collection(_royaltyRecipient, _royaltyFee);
        emit CollectionWhitelisted(_nft, _royaltyRecipient, _royaltyFee);
    }

    function removeFromWhitelist(address _nft) external onlyOwner onlyWhitelisted(_nft) {
        delete whitelistedCollections[_nft];
        emit CollectionRemoved(_nft);
    }

    function updateWhitelist(address _nftAddress, address _royaltyRecipient, uint _royaltyFee) external onlyOwner onlyWhitelisted(_nftAddress) {

        whitelistedCollections[_nftAddress] = Collection(_royaltyRecipient, _royaltyFee);
        emit CollectionUpdated(_nftAddress, _royaltyRecipient, _royaltyFee);

    }
}