// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title SS2Token
 * @dev SS2 Reward Token (ERC20, Burnable, Role-based minting)
 * 
 * SS2 프로젝트의 보상 토큰입니다. 
 * 초기 발행량은 1억 개이며, 운영자/팀/투자자에게 각각 70/20/10%가 분배됩니다.
 * MINTER_ROLE을 가진 계정만 추가 발행이 가능하며, 누구나 자신의 토큰을 소각할 수 있습니다.
 */
contract SS2Token is ERC20, ERC20Burnable, AccessControl {
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
     * @notice SS2Token 컨트랙트 생성자
     * @param _teamWallet 팀 지갑 주소 (20% 할당)
     * @param _investorWallet 투자자 지갑 주소 (10% 할당)
     * 
     * @dev
     * - 총 공급량 1억 개 토큰을 70% 운영자, 20% 팀, 10% 투자자에게 분배합니다.
     * - 배포자에게는 MINTER_ROLE과 DEFAULT_ADMIN_ROLE이 부여됩니다.
     */
    constructor(address _teamWallet, address _investorWallet) ERC20("SS2 Reward Token", "SS2") {
        teamWallet = _teamWallet;
        investorWallet = _investorWallet;
        operatorWallet = msg.sender; // 배포자 지갑 주소
        // 배포자에게 MINTER_ROLE과 DEFAULT_ADMIN_ROLE 부여
        _grantRole(DEFAULT_ADMIN_ROLE, operatorWallet);
        _grantRole(MINTER_ROLE, operatorWallet);

        uint256 totalSupply = 100_000_000 * 10**decimals();
        _mint(operatorWallet, totalSupply * 70 / 100); // 70%: 운영자
        _mint(teamWallet, totalSupply * 20 / 100);  // 20%: 팀
        _mint(investorWallet, totalSupply * 10 / 100); // 10%: 투자자
    }

    /**
     * @notice MINTER_ROLE 계정이 호출할 수 있는 추가 토큰 발행 함수
     * @param to 토큰을 받을 주소
     * @param amount 발행할 토큰 수량 (18자리 소수점 단위)
     * @dev 팀/투자자 할당은 생성자에서만 진행되며, 이 함수에서는 추가 발행만 수행합니다.
     * @custom:requires MINTER_ROLE
     */
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
    
    /**
     * @notice 데이터 제출시 보상 지급
     * @param user 데이터 제출한 사용자 주소
     */
    function rewardForDataSubmission(address user, uint256 actionType) external {
        // 데이터 제출 검증(생략: 오프체인에서 처리, 온체인에서는 최소한의 조건만 체크)
        uint256 rewardAmount = getRewardAmount(actionType);
        _transfer(operatorWallet, user, rewardAmount); // 보상 지급
    }

    /**
     * @notice 제출된 데이터에 대한 보상 금액 계산
     * @param actionType 데이터 제출 유형 (0: default, 1: 광고 클릭, 2: 구매)
     * @return 보상비율 (0.01 단위)
     */
    function getRewardAmount(uint256 actionType) public pure returns (uint256) {
        if (actionType == 0) return 50 * 10**18; // 기본 보상
        if (actionType == 1) return 100 * 10**18;
        if (actionType == 2) return 200 * 10**18;
        return 50 * 10**18;
    }

    /**
     * @notice 구매 금액에 따른 할인율 계산
     * @param purchaseAmount 구매 금액 중 토큰으로 지급할 금액
     */
    function purchaseWithDiscount(address buyer, uint256 purchaseAmount, address sellerWallet) external {
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

}
