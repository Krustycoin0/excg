// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SwapWithFee {
    address public feeCollector;
    uint256 public feePercent; // es: 3 (0.3%)

    constructor(address _feeCollector, uint256 _feePercent) {
        feeCollector = _feeCollector;
        feePercent = _feePercent; // 3 = 0.3%
    }

    function swap() external payable {
        uint256 fee = (msg.value * feePercent) / 1000;
        require(fee > 0, "Fee too low");
        payable(feeCollector).transfer(fee);
        // Qui la logica di swap come vuoi tu (es: invio, DEX, ecc.)
    }
}
