pragma solidity 0.8.1;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC721, Ownable {
    struct Plant {
        uint8 health;
        uint8 feature;
        uint256 lastWatered;
        uint256 endurance;
    }

    uint256 nextId = 0;

    mapping(uint256 => Plant) private _tokenDetails;

    constructor(string memory name, string memory symbol)
        ERC721(name, symbol)
    {}

    function getTokenDetails(uint256 tokenId)
        public
        view
        returns (Plant memory)
    {
        return _tokenDetails[tokenId];
    }

    function mint(
        uint8 health,
        uint8 feature,
        uint256 endurance
    ) public onlyOwner {
        _tokenDetails[nextId] = Plant(
            health,
            feature,
            block.timestamp,
            endurance
        );
        _safeMint(msg.sender, nextId);
        nextId++;
    }

    function water(uint256 tokenId) public {
        Plant storage plant = _tokenDetails[tokenId];
        require(plant.lastWatered + plant.endurance > block.timestamp);
        plant.lastWatered = block.timestamp;
    }

    function getAllTokensForUser(address user)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(user);
        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalPlants = nextId;
            uint256 resultIndex = 0;
            uint256 i;
            for (i = 0; i < totalPlants; i++) {
                if (ownerOf(i) == user) {
                    result[resultIndex] = i;
                    resultIndex++;
                }
            }
            return result;
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        Plant storage plant = _tokenDetails[tokenId];
        require(plant.lastWatered + plant.endurance > block.timestamp);
    }
}
