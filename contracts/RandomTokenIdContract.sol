//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

contract RandomTokenIdContract is ERC721Enumerable, Ownable {

    using SafeERC20 for IERC20;

    uint constant maxSupply = 40000;

    uint constant maxMintPerTransaction = 5;

    uint public minted;

    IERC20 honeyContract;

    struct VRFRequest {
        address owner;
        uint128 amount;
    }

    /// @notice Mapping is used to keep track of the unminted token ids
    mapping(uint => uint) tokenIdMapping;

    /// @notice mapping used to set custom token generation for winners of the queen auction
    mapping(uint => uint) customEmissionRate;

    /// @notice mapping used to track mint requests sent to chainlink VRF
    mapping(bytes32 => VRFRequest) VRFRequests;

    constructor(address _honeyAddress) ERC721("RandomId", "RandomId") {

        honeyContract = IERC20(_honeyAddress);

    }

    function publicMint(uint _amount) public {

        require(_amount <= maxMintPerTransaction, "Attempting to mint too many at once");
        require(_amount + minted <= maxSupply, "Attempting to mint over max supply");
        
        uint price = getMintCost(_amount + minted);

        minted += _amount;

        //Should fail if the owner doesnt have enough honey tokens
        honeyContract.safeTransferFrom(_msgSender(), owner(), price);

    }


    //TODO: make this internal and call by chainLink VRF for truely random number
    function mintRandom(uint _randomNumber, address _reciepient) public {

        uint range = maxSupply - totalSupply();

        uint index = (_randomNumber % range) + 1;

        mintInternal(index, range, _reciepient);

    }

    function mintInternal(uint _index, uint _range, address _recipient) internal {

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

    }

    //TODO: add modifier to make only callable when the auction is going
    function auctionMint(uint tokenId, uint emissionRate, address _reciepient) external onlyOwner {

        uint range = maxSupply - totalSupply();

        mintInternal(tokenId, range, _reciepient);

        if(emissionRate > 0) {

            customEmissionRate[tokenId] = emissionRate;

        }

    }

    /// @notice Returns the token's daily rate of honey generation
    function getTokensEmissionRate(uint _tokenId) public view returns(uint) {

        uint customEmissions = customEmissionRate[_tokenId];

        if(customEmissions > 0) {
            return customEmissions;
        }

        if(_tokenId < 201) {
            return 0.2 ether;
        } else if(_tokenId < 39201) {
            return 0.1 ether;
        }

        return 0.05 ether;

    }

    //TODO: this will be set by Sam, so using this as a placeholder
    function getMintCost(uint totalAmount) public view returns(uint) {

        return 10 ether;

    }



}