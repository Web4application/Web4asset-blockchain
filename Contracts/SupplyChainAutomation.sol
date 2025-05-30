// contracts/SupplyChainAutomation.sol
pragma solidity ^0.4.17;

contract SupplyChainAutomation {
    address public currentOwner;
    uint public productId;
    bool public isProductShipped;
    bool public shipmentDelayed;
    address public oracleAddress;
    Oracle oracle;

    event ProductShipped(uint productId, bool status);
    event ShipmentDelayPredicted(uint productId, bool delayed);

    constructor(address _oracleAddress) public {
        oracleAddress = _oracleAddress;
        oracle = Oracle(oracleAddress);
    }

    function triggerShipment(uint _productId, bool status) public {
        require(msg.sender == currentOwner, "Only current owner can trigger this.");
        productId = _productId;
        isProductShipped = status;
        
        bool delay = oracle.getPrediction();

        if (delay) {
            shipmentDelayed = true;
            emit ShipmentDelayPredicted(productId, true);
            emit ProductShipped(productId, false);  // Denote the shipment is delayed
        } else {
            shipmentDelayed = false;
            emit ShipmentDelayPredicted(productId, false);
            emit ProductShipped(productId, true);  // Shipment is on-time
        }
    }
}
