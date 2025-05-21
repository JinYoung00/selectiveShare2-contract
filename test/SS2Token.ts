import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";

describe("SS2Token", function () {
    let operator: any;
    let seller: any;
    let team: any;
    let investor: any;
    let minterRole: any;
    async function deployContract() {
        // 배포할 지갑 주소 설정 
        const [operator, team, investor, user1, seller] = await ethers.getSigners();

        const SS2Token = await ethers.getContractFactory("SS2Token");
        const ss2Token = await SS2Token.deploy(
            team.address,
            investor.address
        );
        
        return {ss2Token, operator, team, investor, user1, seller};
    }

    describe("배포 및 초기화", function () {
        it("SS2Token이 올바르게 배포되어야 함", async function () {
            const { ss2Token, operator, team, investor} = await loadFixture(deployContract);
            const totalSupply = await ss2Token.totalSupply();
            const operatorBalance = await ss2Token.balanceOf(operator.address);
            const teamBalance = await ss2Token.balanceOf(team.address);
            const investorBalance = await ss2Token.balanceOf(investor.address);
        
            expect(totalSupply).to.equal(parseUnits("100000000", 18));
            expect(operatorBalance).to.equal((totalSupply*70n)/100n);
            expect(teamBalance).to.equal((totalSupply*20n)/100n);
            expect(investorBalance).to.equal((totalSupply*10n)/100n);
        });
    })

    describe("역할 관리", function () {
        it("MINTER_ROLE이 올바르게 설정되어야 한다", async function () {
            const { ss2Token, operator} = await loadFixture(deployContract);
            const minterRole = await ss2Token.MINTER_ROLE();
            const hasRole = await ss2Token.hasRole(minterRole, operator.address);
            expect(hasRole).to.be.true;
        });

        it("MINTER_ROLE이 올바르게 부여되어야 한다", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            const minterRole = await ss2Token.MINTER_ROLE();
            await ss2Token.grantRole(minterRole, user1.address);
            const hasRole = await ss2Token.hasRole(minterRole, user1.address);
            expect(hasRole).to.be.true;
        });

        it("MINTER_ROLE이 올바르게 회수되어야 한다", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            const minterRole = await ss2Token.MINTER_ROLE();
            await ss2Token.revokeRole(minterRole, user1.address);
            const hasRole = await ss2Token.hasRole(minterRole, user1.address);
            expect(hasRole).to.be.false;
        });
    })

    describe("토큰 발행", function () {
        it("MINTER_ROLE이 mint로 토큰을 발행할 수 있다", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            const mintAmount = ethers.parseUnits("1000", 18);
            await ss2Token.mint(user1.address, mintAmount);
            const userBalance = await ss2Token.balanceOf(user1.address);
            expect(userBalance).to.equal(mintAmount);
        });
    
        it("MINTER_ROLE이 없는 계정은 mint 호출 시 revert되어야 한다", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            const mintAmount = ethers.parseUnits("1000", 18);
            await expect(
              ss2Token.connect(user1).mint(user1.address, mintAmount)
            ).to.be.reverted;
          });

    })


    describe("토큰 전송", function () {
    it("토큰을 올바르게 전송할 수 있다", async function () {
        const { ss2Token, user1 } = await loadFixture(deployContract);
        const transferAmount = ethers.parseUnits("1000", 18);
        await ss2Token.transfer(user1.address, transferAmount);
        const userBalance = await ss2Token.balanceOf(user1.address);
        expect(userBalance).to.equal(transferAmount);
    });

    it("토큰 전송 시 잔액이 부족할 경우 revert되어야 한다", async function () {
        const { ss2Token, operator, user1 } = await loadFixture(deployContract);
        const transferAmount = ethers.parseUnits("1000", 18);
        await expect(
            ss2Token.connect(user1).transfer(operator.address, transferAmount)
        ).to.be.reverted;
        });

    })

    describe("토큰 운영비 풀 보상 지급 및 소각", function () {
        it("rewardForDataSubmission 호출 시 올바른 보상 지급", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            // actionType 0: 50, 1: 100, 2: 200
            const reward0 = await ss2Token.getRewardAmount(0);
            const reward1 = await ss2Token.getRewardAmount(1);
            const reward2 = await ss2Token.getRewardAmount(2);
        
            await ss2Token.rewardForDataSubmission(user1.address, 0);
            expect(await ss2Token.balanceOf(user1.address)).to.equal(reward0);
        
            await ss2Token.rewardForDataSubmission(user1.address, 1);
            expect(await ss2Token.balanceOf(user1.address)).to.equal(reward0 + reward1);
        
            await ss2Token.rewardForDataSubmission(user1.address, 2);
            expect(await ss2Token.balanceOf(user1.address)).to.equal(reward0 + reward1 + reward2);
            });
    
        it("getRewardAmount가 actionType에 따라 올바른 금액을 반환한다", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            const reward0 = await ss2Token.getRewardAmount(0);
            const reward1 = await ss2Token.getRewardAmount(1);
            const reward2 = await ss2Token.getRewardAmount(2);
            const rewardDefault = await ss2Token.getRewardAmount(999);
        
            expect(reward0).to.equal(ethers.parseUnits("50", 18));
            expect(reward1).to.equal(ethers.parseUnits("100", 18));
            expect(reward2).to.equal(ethers.parseUnits("200", 18));
            expect(rewardDefault).to.equal(ethers.parseUnits("50", 18));
        });
    
        it("rewardForDataSubmission: 운영자 보유분에서 user1에게 보상이 지급되어야 한다", async function () {
            const { ss2Token, user1 } = await loadFixture(deployContract);
            const operatorWallet = await ss2Token.operatorWallet();
            const actionType = 1; // 광고 클릭
            const reward = await ss2Token.getRewardAmount(actionType);
        
            const beforeOperator = await ss2Token.balanceOf(operatorWallet);
            const beforeUser = await ss2Token.balanceOf(user1.address);
        
            await ss2Token.rewardForDataSubmission(user1.address, actionType);
        
            expect(await ss2Token.balanceOf(operatorWallet)).to.equal(beforeOperator - reward);
            expect(await ss2Token.balanceOf(user1.address)).to.equal(beforeUser + reward);
          });
        
          it("purchaseWithDiscount: 소각, 수수료, 판매자 지급이 올바르게 처리되어야 한다", async function () {
            const { ss2Token, operator, user1, seller} = await loadFixture(deployContract);
            const operatorWallet = await ss2Token.operatorWallet();
            const purchaseAmount = ethers.parseUnits("1000", 18);
        
            // 운영자가 user1에게 구매에 쓸 토큰을 지급
            await ss2Token.connect(operator).transfer(user1.address, purchaseAmount);
        
            const BURN_RATE = await ss2Token.BURN_RATE();
            const OPERATOR_RATE = await ss2Token.OPERATOR_RATE();
        
            const burnAmount = (purchaseAmount * BURN_RATE) / 100n;
            const operatorFee = (purchaseAmount * OPERATOR_RATE) / 100n;
            const sellerAmount = purchaseAmount - burnAmount - operatorFee;
        
            const beforeSupply = await ss2Token.totalSupply();
            const beforeOperator = await ss2Token.balanceOf(operatorWallet);
            const beforeSeller = await ss2Token.balanceOf(seller.address);
        
            await ss2Token.connect(user1).purchaseWithDiscount(user1.address, purchaseAmount, seller.address);
        
            // 판매자 지급 확인
            expect(await ss2Token.balanceOf(seller.address)).to.equal(beforeSeller + sellerAmount);
        
            // operatorFee만큼 운영자 잔액 증가
            expect(await ss2Token.balanceOf(operatorWallet)).to.equal(beforeOperator + operatorFee);
        
            // 소각량만큼 totalSupply 감소
            const afterSupply = await ss2Token.totalSupply();
            expect(beforeSupply - afterSupply).to.equal(burnAmount);
        
            // user1 잔액은 0이어야 함 (모두 사용)
            expect(await ss2Token.balanceOf(user1.address)).to.equal(0n);
          });

    })
});
