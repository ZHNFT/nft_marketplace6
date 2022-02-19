//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract RandomTokenIdContract is ERC721, Ownable, VRFConsumerBase {

    using SafeERC20 for IERC20;

    uint public maxSupply = 20;

    uint constant maxMintPerTransaction = 5;

    uint public minted;

    IERC20 honeyContract;

    struct VRFRequest {
        address owner;
        uint128 amount;
    }

    struct EmmisionRate {
        uint range;
        uint rate;
    }

    EmmisionRate[] emissionRates;

    bytes32 internal keyHash;
    uint256 internal fee;

    uint intitialIndex = 0;

    uint currentSupply = 0;

    /// @notice Mapping is used to keep track of the unminted token ids
    mapping(uint => uint) tokenIdMapping;

    /// @notice mapping used to set custom token generation for winners of the queen auction
    mapping(uint => uint) customEmissionRate;

    /// @notice mapping used to track mint requests sent to chainlink VRF
    mapping(bytes32 => VRFRequest) VRFRequests;

    /// @notice mapping used to determine if an opperator is allowed to transfer the token on behalf of a user
    mapping(address => bool) whitelistedOpperators;

    /// TODO: Must change the VRF values before deploying to mainnet
    /**
     * Constructor inherits VRFConsumerBase
     * 
     * Network: Mubai
     * Chainlink VRF Coordinator address: 0x8C7382F9D8f56b33781fE506E897a4F1e2d17255
     * LINK token address:                0x326C977E6efc84E512bB9C30f76E30c160eD06FB
     * Key Hash: 0x6c3699283bda56ad74f6b855546325b68d482e983852a7a82979cc4807b641f4
     */
    constructor(address _honeyAddress) 
        VRFConsumerBase(
            0x8C7382F9D8f56b33781fE506E897a4F1e2d17255, // VRF Coordinator
            0x326C977E6efc84E512bB9C30f76E30c160eD06FB  // LINK Token
        )
        ERC721("RandomId", "RandomId")
    {
        keyHash = 0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4;
        fee = 0.0001 * 10 ** 18; // 0.0001 LINK (Varies by network)

        honeyContract = IERC20(_honeyAddress);
    }

    function publicMint(uint _amount) public {

        require(_amount <= maxMintPerTransaction, "Attempting to mint too many at once");
        require(_amount + minted <= maxSupply, "Attempting to mint over max supply");
        
        uint price = getMintCost(_amount + minted);

        minted += _amount;

        //Should fail if the owner doesnt have enough honey tokens, or this contract hasnt been approved
        //TODO: do i use the owner address, and do i use the send keyword, does it trigger a bunch of opperations once the contract has recieved the tokens?
        honeyContract.safeTransferFrom(_msgSender(), owner(), price);

        bytes32 requestId = getRandomNumber();

        VRFRequests[requestId] = VRFRequest(msg.sender, uint128(_amount));

    }

    function mintRandom(uint _randomNumber, address _reciepient) internal returns(uint){

        uint range = maxSupply - currentSupply;

        //Get a random number within the proper range
        /// @notice the initial index is added in case we want to release another collection
        uint index = ((_randomNumber % range) + 1) + intitialIndex;

        return mintInternal(index, range, _reciepient);

    }

    function mintInternal(uint _index, uint _range, address _recipient) internal returns(uint) {

        //Retrieve value set in the token mapping, value can range from 0 - maxSupply, if value is not zero, the token id to mint is the value set 
        uint value = tokenIdMapping[_index];

        if(value == 0) {
            //Value has not been set, so the token id to mint is the index chosen
            value = _index;
        }
        
        //mint the chosen tokenId
        _mint(_recipient, value);
       
       //now the range will be reduced by 1, so we need to set the value at index to the value at the end of the range,
       //if the end value is zero then set index's value to be the range
       uint finalValue = tokenIdMapping[_range];

       if(finalValue > 0) {
           //value is non zero and we no longer need it stored, so deleting it to refund caller some gas
           delete tokenIdMapping[_range];
       } else {
           //value is zero, so will use the token index  
           finalValue = _range;
       }

       //set the value of the end index to the chosen index, so that tokenId will still be chosen eventually
       tokenIdMapping[_index] = finalValue;

       //TODO: notify honey contract that a token has been minted

       currentSupply++;

       return value;

    }


    //TODO: add modifier to make only callable when the auction is going
    function auctionMint(uint tokenId, uint emissionRate, address _reciepient) external onlyOwner {

        uint range = maxSupply - currentSupply;

        mintInternal(tokenId, range, _reciepient);

        if(emissionRate > 0) {

            customEmissionRate[tokenId] = emissionRate;

        }

    }

    /** 
     * Requests randomness 
     */
    function getRandomNumber() public returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    /**
     * Callback function used by VRF Coordinator
     */
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {

        VRFRequest memory request = VRFRequests[requestId];

        // delete the request id to refund some gas, as its isnt needed anymore
        delete VRFRequests[requestId];

        for(uint i = 0; i < request.amount; i++) {
            
            //Call the function that mints the nft for the user, will shuffle the random number each time
            mintRandom(uint(keccak256(abi.encode(randomness, i))), request.owner);

        }

       
    }

    function mintTest(uint _randomness) external returns(uint) {

       
       
            
            //Call the function that mints the nft for the user, will shuffle the random number each time
            return mintRandom(uint(keccak256(abi.encode(_randomness))), msg.sender);

        

       
    }
    

    /// @notice Returns the token's daily rate of honey generation
    function getTokensEmissionRate(uint _tokenId) public view returns(uint) {

        uint customEmissions = customEmissionRate[_tokenId];

        if(customEmissions > 0) {
            return customEmissions;
        }

        EmmisionRate[] memory _rates = emissionRates;

        for(uint i = 0; i < _rates.length; i++) {

            if(_tokenId < _rates[i].range) {
                return _rates[i].rate;
            }

        }

        return 0;

    }

    function getMultipleTokensEmissionRate(uint[] calldata _tokenIds) public view returns(uint total) {

        for(uint i = 0; i < _tokenIds.length; i++) {

            total += getTokensEmissionRate(_tokenIds[i]);
        }

    }

    function internalGetTokenEmissionRate(uint _tokenId, EmmisionRate[] memory _rates) internal view returns(uint) {

        uint customEmissions = customEmissionRate[_tokenId];

        if(customEmissions > 0) {
            return customEmissions;
        }

        for(uint i = 0; i < _rates.length; i++) {

            if(_tokenId < _rates[i].range) {
                return _rates[i].rate;
            }

        }

        return 0;

    }

    //TODO: this will be set by Sam, so using this as a placeholder
    function getMintCost(uint totalAmount) public view returns(uint) {

        return 10 ether;

    }

     /**
     * @dev Returns whether `spender` is allowed to manage `tokenId`.
     *
     * Requirements:
     *
     * - `tokenId` must exist.
     * @notice If the spender isn't the owner, it will require the opperator to be whitelisted
     */
    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view override returns (bool) {
        require(_exists(tokenId), "ERC721: operator query for nonexistent token");
        address owner = ERC721.ownerOf(tokenId);
        return (spender == owner || (getApproved(tokenId) == spender || isApprovedForAll(owner, spender)) && whitelistedOpperators[spender]);
    }



    function updateWhitelistedOpperators(address _address, bool value) external onlyOwner {

        whitelistedOpperators[_address] = value;

    }

    function setEmissionRates(EmmisionRate[] calldata _rates) onlyOwner external {

        for(uint i = 0; i < _rates.length; i++) {

            emissionRates[i] = _rates[i];

        }

    }

    function increaseMaxSupply(uint _increaseAmount) onlyOwner external {

        require(currentSupply == maxSupply, "Cant increase max supply until all have been minted");

        maxSupply += _increaseAmount;

        intitialIndex += _increaseAmount;

    }


}