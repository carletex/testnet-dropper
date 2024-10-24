//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Faucet is AccessControl {
	bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");
	uint256 public amount = 0.001 ether;

	event Withdraw(address indexed from, address indexed to, uint256 amount);
	event AmountChanged(uint256 amount);

	constructor() {
		_grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
		_grantRole(WITHDRAW_ROLE, msg.sender);
	}

	function withdraw(address payable to) public onlyRole(WITHDRAW_ROLE) {
		to.transfer(amount);
		emit Withdraw(msg.sender, to, amount);
	}

	function transferOwnership(
		address newOwner
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		require(
			!hasRole(DEFAULT_ADMIN_ROLE, newOwner),
			"Ownable: new owner already have admin role"
		);

		grantRole(DEFAULT_ADMIN_ROLE, newOwner);
		renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
	}

	function setAmount(uint256 _amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
		amount = _amount;
		emit AmountChanged(amount);
	}

	function grantWithdrawRole(
		address account
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		grantRole(WITHDRAW_ROLE, account);
	}

	function revokeWithdrawRole(
		address account
	) public onlyRole(DEFAULT_ADMIN_ROLE) {
		revokeRole(WITHDRAW_ROLE, account);
	}

	receive() external payable {}
}
