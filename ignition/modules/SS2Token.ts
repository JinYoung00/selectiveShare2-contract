import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SS2TokenModule = buildModule("SS2TokenModule", (m) => {
    // 파라미터 설정 (실제 배포 시 값 변경 필요)
    const teamWallet = m.getParameter(
        "teamWallet", 
        "0x1234...abcd" // 기본값: 실제 지갑 주소 입력
    );
    const investorWallet = m.getParameter(
        "investorWallet", 
        "0x5678...efgh" // 기본값: 실제 지갑 주소 입력
    );

    // 생성자 파라미터 전달
    const ss2Token = m.contract("SS2Token", [teamWallet, investorWallet]);

    return { ss2Token };
});

export default SS2TokenModule;