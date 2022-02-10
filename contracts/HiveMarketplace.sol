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
    uint256 public constant BASIS_POINTS = 10000;

    address public paymentToken;

    uint256 public fee;
    address public feeReceipient;


    struct Listing {
        uint256 quantity;
        uint256 pricePerItem;
        uint256 expirationTime;
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

    mapping(address => mapping(uint256 => mapping(address => Listing))) public listings;
    mapping(address => Collection) public whitelistedCollections;

    event UpdateFee(uint256 fee);
    event UpdateFeeRecipient(address feeRecipient);
    event UpdateOracle(address oracle);
    event UpdatePaymentToken(address paymentToken);

    event CollectionWhitelisted(address nft, address royaltyRecipient, uint royaltyFee);
    event CollectionRemoved(address nft);
    event CollectionUpdated(address nftAddress, address royaltyRecipient, uint royaltyFee);

    event ItemListed(
        address seller,
        address nftAddress,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem,
        uint256 expirationTime
    );

    event ItemUpdated(
        address seller,
        address nftAddress,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem,
        uint256 expirationTime
    );

    event ItemSold(
        address seller,
        address buyer,
        address nftAddress,
        uint256 tokenId,
        uint256 quantity,
        uint256 pricePerItem
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

    constructor(uint256 _fee, address _feeRecipient, address _paymentToken) {
        setFee(_fee);
        setFeeRecipient(_feeRecipient);
        setPaymentToken(_paymentToken);
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

        _buyItem(listedItem.pricePerItem, _buyOrder.quantity, _buyOrder.owner, _buyOrder.nftAddress);
    }

    function _buyItem(
        uint256 _pricePerItem,
        uint256 _quantity,
        address _owner,
        address _nftAddress
    ) internal {

        uint256 totalPrice = _pricePerItem * _quantity;

        if(totalPrice > 0) {

            uint256 feeAmount = totalPrice * fee / BASIS_POINTS;

            Collection memory collection = whitelistedCollections[_nftAddress];

            uint256 royalty = totalPrice * collection.royaltyFee / BASIS_POINTS;

            IERC20(paymentToken).safeTransferFrom(_msgSender(), feeReceipient, feeAmount);

            if(royalty > 0) {
            
                IERC20(paymentToken).safeTransferFrom(_msgSender(), collection.royaltyRecipient, royalty);

            }

            IERC20(paymentToken).safeTransferFrom(_msgSender(), _owner, (totalPrice - feeAmount) - royalty);

        }
    }

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