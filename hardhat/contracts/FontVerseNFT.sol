// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FontVerseNFT is ERC721URIStorage {
    string _baseTokeURI;
    uint256 basePrice = 0.01 ether;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable owner;

    // Token(Font) Struture
     struct FontToken {
        uint256 tokenId;
        address payable owner;
        address payable seller;
        uint256 price;
        bool currentlyAvailable;

    }

    mapping(uint256 => FontToken) private idToFontToken;

    constructor (string memory baseURI) ERC721("FontVerseNFT", "FV"){
        owner = payable(msg.sender);
        _baseTokeURI = baseURI;
    }

    // Mint Token
    function mintFont(string memory tokenURI, uint256 price) public payable returns(uint256){
        _tokenIds.increment();

        uint256 newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);

        _setTokenURI(newTokenId, tokenURI);

        createListedFont(newTokenId, price);

        return newTokenId;
    }


    function createListedFont(uint256 tokenId, uint256 price) private {
        require(msg.value > basePrice, "Not enough");

        idToFontToken[tokenId] = FontToken(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            true
        ); 

        _transfer(msg.sender, address(this), tokenId);
    }
}