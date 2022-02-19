// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/interfaces/IERC165.sol';
import '@openzeppelin/contracts/token/ERC1155/IERC1155.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract HiveMarketplace is Ownable, ReentrancyGuard {
    
    using SafeERC20 for IERC20;

    bytes4 private constant INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes4 private constant INTERFACE_ID_ERC1155 = 0xd9b67a26;
    uint public constant BASIS_POINTS = 10000;

    address public paymentToken;

    uint256 public fee;
    address public feeReceipient;

    uint public minBidTime;


    struct Listing {
        uint quantity;
        uint pricePerItem;
        uint expirationTime;
    }

    struct Collection {
        address royaltyRecipient;
        uint royaltyFee;
    }

    struct BuyOrder {
        address nftAddress;
        address owner;
        uint quantity;
        uint tokenId;
        uint pricePerItem;
    }

    struct Bid {
        uint quantity;
        uint pricePerItem;
        uint expirationTime;
        address bidder;
    }

    mapping(address => mapping(uint => mapping(address => Listing))) public listings;
    mapping(address => Collection) public whitelistedCollections;

    mapping(address => mapping(uint => Bid)) public bids;

    event UpdateFee(uint fee);
    event UpdateFeeRecipient(address feeRecipient);
    
    event UpdatePaymentToken(address paymentToken);

    event CollectionWhitelisted(address nftAddress, address royaltyRecipient, uint royaltyFee);
    event CollectionRemoved(address nftAddress);
    event CollectionUpdated(address nftAddress, address royaltyRecipient, uint royaltyFee);

    event ItemListed(
        address seller,
        address nftAddress,
        uint tokenId,
        uint quantity,
        uint pricePerItem,
        uint expirationTime
    );

    event ItemUpdated(
        address seller,
        address nftAddress,
        uint tokenId,
        uint quantity,
        uint pricePerItem,
        uint expirationTime
    );

    event ItemSold(
        address seller,
        address buyer,
        address nftAddress,
        uint tokenId,
        uint quantity,
        uint pricePerItem
    );

    event ItemBid(
        address nftAddress,
        address bidder,
        address buyer,
        uint quantity,
        uint tokenId,
        uint pricePerItem
    );

    event ItemCanceled(address seller, address nftAddress, uint256 tokenId);

    modifier isListed(
        address _nftAddress,
        uint256 _tokenId,
        address _owner
    ) {
        Listing memory listing = listings[_nftAddress][_tokenId][_owner];
        require(listing.quantity > 0, "not listed item");
        _;
    }

    modifier notListed(
        address _nftAddress,
        uint256 _tokenId,
        address _owner
    ) {
        Listing memory listing = listings[_nftAddress][_tokenId][_owner];
        require(listing.quantity == 0, "already listed");
        _;
    }

    modifier validListing(
        address _nftAddress,
        uint256 _tokenId,
        address _owner
    ) {
        Listing memory listedItem = listings[_nftAddress][_tokenId][_owner];
        if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721 nft = IERC721(_nftAddress);
            require(nft.ownerOf(_tokenId) == _owner, "not owning item");
        } else if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC1155)) {
            IERC1155 nft = IERC1155(_nftAddress);
            require(nft.balanceOf(_owner, _tokenId) >= listedItem.quantity, "not owning item");
        } else {
            revert("invalid nft address");
        }
        require(listedItem.expirationTime >= block.timestamp, "listing expired");
        _;
    }

    modifier onlyWhitelisted(address nft) {
        require(whitelistedCollections[nft].royaltyFee > 0, "nft not whitelisted");
        _;
    }

    // constructor(uint256 _fee, address _feeRecipient, address _paymentToken) {
    constructor() {
        // setFee(_fee);
        // setFeeRecipient(_feeRecipient);
        // setPaymentToken(_paymentToken);
        _initializeNFTBids();
    }

    function createListing(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _quantity,
        uint256 _pricePerItem,
        uint256 _expirationTime
    ) external notListed(_nftAddress, _tokenId, _msgSender()) onlyWhitelisted(_nftAddress) {
        if (_expirationTime == 0) _expirationTime = type(uint256).max;
        require(_expirationTime > block.timestamp, "invalid expiration time");
        require(_quantity > 0, "nothing to list");
        if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721 nft = IERC721(_nftAddress);
            require(nft.ownerOf(_tokenId) == _msgSender(), "not owning item");
            require(nft.isApprovedForAll(_msgSender(), address(this)), "item not approved");
        } else if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC1155)) {
            IERC1155 nft = IERC1155(_nftAddress);
            require(nft.balanceOf(_msgSender(), _tokenId) >= _quantity, "must hold enough nfts");
            require(nft.isApprovedForAll(_msgSender(), address(this)), "item not approved");
        } else {
            revert("invalid nft address");
        }

        listings[_nftAddress][_tokenId][_msgSender()] = Listing(
            _quantity,
            _pricePerItem,
            _expirationTime
        );

        emit ItemListed(
            _msgSender(),
            _nftAddress,
            _tokenId,
            _quantity,
            _pricePerItem,
            _expirationTime
        );
    }

    function updateListing(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _newQuantity,
        uint256 _newPricePerItem,
        uint256 _newExpirationTime
    ) external nonReentrant isListed(_nftAddress, _tokenId, _msgSender()) {
        require(_newExpirationTime > block.timestamp, "invalid expiration time");

        Listing storage listedItem = listings[_nftAddress][_tokenId][_msgSender()];
        if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721 nft = IERC721(_nftAddress);
            require(nft.ownerOf(_tokenId) == _msgSender(), "not owning item");
        } else if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC1155)) {
            IERC1155 nft = IERC1155(_nftAddress);
            require(nft.balanceOf(_msgSender(), _tokenId) >= _newQuantity, "must hold enough nfts");
        } else {
            revert("invalid nft address");
        }

        listedItem.quantity = _newQuantity;
        listedItem.pricePerItem = _newPricePerItem;
        listedItem.expirationTime = _newExpirationTime;

        emit ItemUpdated(
            _msgSender(),
            _nftAddress,
            _tokenId,
            _newQuantity,
            _newPricePerItem,
            _newExpirationTime
        );
    }

    function cancelListing(address _nftAddress, uint256 _tokenId)
        external
        nonReentrant
        isListed(_nftAddress, _tokenId, _msgSender())
    {
        _cancelListing(_nftAddress, _tokenId, _msgSender());
    }

    function _cancelListing(
        address _nftAddress,
        uint256 _tokenId,
        address _owner
    ) internal {
        Listing memory listedItem = listings[_nftAddress][_tokenId][_owner];
        if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721 nft = IERC721(_nftAddress);
            require(nft.ownerOf(_tokenId) == _owner, "Does not own item");
        } else if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC1155)) {
            IERC1155 nft = IERC1155(_nftAddress);
            require(nft.balanceOf(_msgSender(), _tokenId) >= listedItem.quantity, "Does not own item");
        } else {
            revert("invalid nft address");
        }

        delete (listings[_nftAddress][_tokenId][_owner]);
        emit ItemCanceled(_owner, _nftAddress, _tokenId);
    }

    function buyItem(
        BuyOrder memory _buyOrder
    )
        external
        nonReentrant
        isListed(_buyOrder.nftAddress, _buyOrder.tokenId, _buyOrder.owner)
        validListing(_buyOrder.nftAddress, _buyOrder.tokenId, _buyOrder.owner)
    {
        require(_msgSender() != _buyOrder.owner, "Must not own item");

        Listing memory listedItem = listings[_buyOrder.nftAddress][_buyOrder.tokenId][_buyOrder.owner];
        require(listedItem.quantity >= _buyOrder.quantity, "Not enough available");

        if (IERC165(_buyOrder.nftAddress).supportsInterface(INTERFACE_ID_ERC721)) {
            IERC721(_buyOrder.nftAddress).safeTransferFrom(_buyOrder.owner, _msgSender(), _buyOrder.tokenId);
        } else {
            IERC1155(_buyOrder.nftAddress).safeTransferFrom(_buyOrder.owner, _msgSender(), _buyOrder.tokenId, _buyOrder.quantity, bytes(""));
        }

        if (listedItem.quantity == _buyOrder.quantity) {
            delete (listings[_buyOrder.nftAddress][_buyOrder.tokenId][_buyOrder.owner]);
        } else {
            listings[_buyOrder.nftAddress][_buyOrder.tokenId][_buyOrder.owner].quantity -= _buyOrder.quantity;
        }

        emit ItemSold(
            _buyOrder.owner,
            _msgSender(),
            _buyOrder.nftAddress,
            _buyOrder.tokenId,
            _buyOrder.quantity,
            listedItem.pricePerItem
        );

        _distributeFunds(listedItem.pricePerItem * listedItem.quantity, _buyOrder.owner, msg.sender, _buyOrder.nftAddress);
    }

    function _distributeFunds(
        uint256 _value,
        address _owner,
        address _buyer,
        address _nftAddress
       
    ) internal returns(uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue){

        if(_value > 0) {

            marketplaceFee = _value * fee / BASIS_POINTS;

            Collection memory collection = whitelistedCollections[_nftAddress];

            creatorFee = _value * collection.royaltyFee / BASIS_POINTS;

            IERC20(paymentToken).safeTransferFrom(_buyer, feeReceipient, marketplaceFee);

            if(creatorFee > 0) {
            
                IERC20(paymentToken).safeTransferFrom(_buyer, collection.royaltyRecipient, creatorFee);

            }

            ownerRevenue = (_value - marketplaceFee) - creatorFee;

            IERC20(paymentToken).safeTransferFrom(_buyer, _owner, ownerRevenue);

        }
    }

    /**
   * @dev This is the domain used in EIP-712 signatures.
   * It is not a constant so that the chainId can be determined dynamically.
   * If multiple classes use EIP-712 signatures in the future this can move to a shared file.
   */
  bytes32 private DOMAIN_SEPARATOR;

  event BidAccepted(
    address indexed nftContract,
    uint256 indexed tokenId,
    address indexed seller,
    address buyer,
    uint256 marketplaceFee,
    uint256 creatorFee,
    uint256 ownerRevenue,
    uint256 expiry
  );

  /**
   * @dev This name is used in the EIP-712 domain.
   * If multiple classes use EIP-712 signatures in the future this can move to the shared constants file.
   */
  string private constant NAME = "HIVENFTMarketplace";

  /**
   * @dev This is a hash of the method signature used in the EIP-712 signature for bids.
   */
  bytes32 private constant ACCEPT_BID_TYPEHASH =
    keccak256("AcceptBid(address nftContractAddress,uint256 tokenId,address owner,address bidder,uint256 pricePerItem,uint256 quantity,uint256 deadline)");

  /**
   * @dev This function must be called at least once before signatures will work as expected.
   * It's okay to call this function many times. Subsequent calls will have no impact.
   */
  function _initializeNFTBids() internal {
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

  /**
   * @notice Allow a bid for a NFT to be accepted by the owner.
   * @dev The buyer signs a message approving the purchase, and then the seller calls this function
   * with the msg.value equal to the agreed upon price.
   * The sale is executed in this single on-chain call including the transfer of funds and the NFT.
   */
  function AcceptBid (
    address nftContractAddress,
    uint256 tokenId,
    uint256 expiry,
    address bidder,
    uint256 pricePerItem,
    uint256 quantity,
    uint8 v,
    bytes32 r,
    bytes32 s
  ) public payable nonReentrant {

    IERC721 nftContract = IERC721(nftContractAddress);
    // The signed message from the seller is only valid for a limited time.
    require(expiry >= block.timestamp, "AcceptBid: EXPIRED");
    // The seller must have the NFT in their wallet when this function is called.
    address payable seller = payable(nftContract.ownerOf(tokenId));

    require(seller == msg.sender, "AcceptBid: NFT Not Owned");

    // Scoping this block to avoid a stack too deep error
    {
      bytes32 digest = keccak256(
        abi.encodePacked(
          "\x19\x01",
          DOMAIN_SEPARATOR,
          keccak256(abi.encode(ACCEPT_BID_TYPEHASH, nftContractAddress, tokenId, seller, bidder, pricePerItem, quantity, expiry))
        )
      );
      // Revert if the signature is invalid, the terms are not as expected, or if the seller transferred the NFT.
      require(ecrecover(digest, v, r, s) == bidder, "AcceptBid: INVALID_SIGNATURE");
    }

    uint256 value = pricePerItem * quantity;

    // This will revert if the seller has not given the market contract approval.
    nftContract.transferFrom(seller, bidder, tokenId);

    // Pay the seller, creator, and Foundation as appropriate.
    // Will revert of the bidder doesn't have the funds
    (uint256 marketplaceFee, uint256 creatorFee, uint256 ownerRevenue) = _distributeFunds(
      value,
      seller,
      bidder,
      nftContractAddress
    );

    emit BidAccepted(
      nftContractAddress,
      tokenId,
      seller,
      bidder,
      marketplaceFee,
      creatorFee,
      ownerRevenue,
      expiry
    );
  }

    // function BidOnItem(Bid memory _bid, address _nftAddress, uint _tokenId, address _owner) public onlyWhitelisted(_nftAddress) {

    //     require(_bid.expirationTime > block.timestamp && _bid.expirationTime - block.timestamp >= minBidTime, "Minimum bid time not reached");
    //     require(_bid.quantity > 0, "Amount not set");

    //     if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC721)) {
    //         IERC721 nft = IERC721(_nftAddress);
    //         require(nft.ownerOf(_tokenId) != _msgSender(), "Already owns item");
    //         require(nft.isApprovedForAll(_msgSender(), address(this)), "item not approved");
    //     } else if (IERC165(_nftAddress).supportsInterface(INTERFACE_ID_ERC1155)) {
    //         IERC1155 nft = IERC1155(_nftAddress);
    //         require(nft.balanceOf(_msgSender(), _tokenId) >= _bid.quantity, "must hold enough nfts");
    //         require(nft.isApprovedForAll(_msgSender(), address(this)), "item not approved");
    //     } else {
    //         revert("invalid nft address");
    //     }

    //     Bid memory previousBid = bids[_nftAddress][_tokenId];

    //     //Check if previous bid is valid
    //     if(previousBid.quantity > 0 && previousBid.expirationTime > block.timestamp) {

    //         uint previousBidsBalance = IERC20(paymentToken).balanceOf(previousBid.bidder);
    //         uint allowance = IERC20(paymentToken).allowance(previousBid.bidder, address(this));

    //         if(previousBidsBalance >= (previousBid.pricePerItem * previousBid.quantity)) {

    //             // there is an existing bid, let check if the bid is greator than the previous bid
    //             require(_bid.pricePerItem > previousBid.pricePerItem, "Current bid is less than previous");
    //         }

    //     }


        


    // }

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