// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title PDT Token (for SS2 Project)
 * @dev Platform reward token used in the SS2 ecosystem.
 * - ERC20-compliant token
 * - Burnable
 * - Role-based minting (MINTER_ROLE)
 * 
 * Initial Allocation:
 * - 70% to operator (platform reserve)
 * - 20% to team
 * - 10% to investors
 */
contract PersonalDataToken is ERC20, ERC20Burnable, AccessControl, Pausable{
    /// @notice 민팅 권한 역할 식별자
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice 팀 지갑 주소 (배포 시 지정, 변경 불가)
    address public immutable teamWallet;
    /// @notice 투자자 지갑 주소 (배포 시 지정, 변경 불가)
    address public immutable investorWallet;
    /// @notice 운영자 지갑 주소 (배포 시 지정, 변경 불가)
    address public immutable operatorWallet;
    
    uint256 public constant BURN_RATE = 1; // 1%
    uint256 public constant OPERATOR_RATE = 5; // 5%

    /**
     * @notice PDT Token Constructor for SS2 Project
     * @param _teamWallet Team wallet address (receives 20% of total supply)
     * @param _investorWallet Investor wallet address (receives 10% of total supply)
     * @param _operatorWallet Operator wallet address (receives 70% of total supply)
     * 
     * @dev
     * @dev
     * - Issues a total supply of 100 million PDT tokens.
     * - Allocation:
     *   - 70% to the operator (platform reserve)
     *   - 20% to the team
     *   - 10% to investors
     * - Deployer is granted both MINTER_ROLE and DEFAULT_ADMIN_ROLE.
     * - PDT is the reward token used in the SS2 data sharing and ad ecosystem.
     */
    constructor(address _teamWallet, address _investorWallet, address _operatorWallet) ERC20("SS2 Platform Reward Token", "PDT") {
        teamWallet = _teamWallet;
        investorWallet = _investorWallet;
        operatorWallet = _operatorWallet; 
        
        _grantRole(DEFAULT_ADMIN_ROLE, operatorWallet);
        _grantRole(MINTER_ROLE, operatorWallet);

        uint256 totalSupply = 100_000_000 * 10**decimals();
        _mint(operatorWallet, totalSupply * 70 / 100); // 70%: 운영자
        _mint(teamWallet, totalSupply * 20 / 100);  // 20%: 팀
        _mint(investorWallet, totalSupply * 10 / 100); // 10%: 투자자
    }

    /**
     * @notice Mints additional PDT tokens. Only callable by accounts with MINTER_ROLE.
     * @param to to Address to receive the tokens.
     * @param amount amount Amount of tokens to mint (18 decimals).
     * @dev
     * - Team/investor allocations are only handled in the constructor.
     * - This function only works when the contract is not paused.
     * @custom:requires MINTER_ROLE
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) whenNotPaused{
        _mint(to, amount);
    }
    
    /**
     * @notice Rewards a user for submitting data based on the action type.
     * @param user Address of the user who submitted the data.
     * @param actionType Type of submission (0: default, 1: ad click, 2: purchase)
     *
     * @dev
     * - Reward amount is determined by the actionType.
     * - Can only be called when the contract is not paused.
     */
    function rewardUser(address user, uint256 actionType) external whenNotPaused{
        // 데이터 제출 검증(생략: 오프체인에서 처리, 온체인에서는 최소한의 조건만 체크)
        require(msg.sender == operatorWallet, "Unauthorized caller");
        uint256 rewardAmount = getRewardAmount(actionType);
        _transfer(operatorWallet, user, rewardAmount); // 보상 지급

        emit RewardGiven(user, actionType, rewardAmount);
    }

    event RewardGiven(address indexed user, uint256 actionType, uint256 rewardAmount);

    /**
     * @notice Returns the reward amount based on the submission type.
     * @param actionType Type of submitted action (0: default, 1: ad click, 2: purchase)
     * @return rewardAmount Amount of token reward (in 18-decimal units)
     *
     * @dev
     * - The reward is determined by fixed values depending on the actionType.
     * - This is a pure function with no state changes.
     */
    function getRewardAmount(uint256 actionType) public pure returns (uint256) {
        if (actionType == 0) return 50 * 10**18; // 기본 보상
        if (actionType == 1) return 100 * 10**18;
        if (actionType == 2) return 200 * 10**18;
        return 50 * 10**18;
    }

    /**
     * @notice Processes a token-based purchase with discount and distribution.
     * @param buyer Address of the user making the token payment
     * @param purchaseAmount Amount of tokens used for purchase (in 18-decimal units)
     * @param sellerWallet Wallet address of the seller (brand)
     *
     * @dev
     * - A portion of the purchase amount is burned (1%), and a fee (5%) is sent to the operator.
     * - The remaining amount is transferred to the seller.
     * - Real-world discount application should be handled off-chain.
     */
    function purchaseWithDiscount(address buyer, uint256 purchaseAmount, address sellerWallet) external whenNotPaused{
        // 구매 금액 검증 (생략: 오프체인에서 처리, 온체인에서는 최소한의 조건만 체크)
        uint256 burnAmount = purchaseAmount * BURN_RATE / 100;   
        uint256 operatorFee = purchaseAmount * OPERATOR_RATE / 100;
        uint256 sellerAmount = purchaseAmount - burnAmount - operatorFee;

        // 1. 소비자 할인 적용 (실제 결제 금액 조정은 오프체인에서)
        // 2. 토큰 소각
        _burn(buyer, burnAmount);
        // 3. 운영자 수수료 지급
        _transfer(buyer, operatorWallet, operatorFee); 
        // 4. 판매자 지급
        _transfer(buyer, sellerWallet, sellerAmount);

        // 기타 구매 처리 로직
    }

    function getBalanceOf(address user) external view returns (uint256) {
        return balanceOf(user);
    }
    
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
}
