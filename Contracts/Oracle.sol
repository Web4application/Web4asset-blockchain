// contracts/Oracle.sol
pragma solidity ^0.4.17;

contract Oracle {
    address public oracleAddress;
    uint public productId;
    bool public delayPrediction;

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Only the oracle can set the prediction.");
        _;
    }

    constructor(address _oracleAddress) public {
        oracleAddress = _oracleAddress;
    }

    function setPrediction(uint _productId, bool _delayPrediction) public onlyOracle {
        productId = _productId;
        delayPrediction = _delayPrediction;
    }

    function getPrediction() public view returns (bool) {
        return delayPrediction;
    }
}
