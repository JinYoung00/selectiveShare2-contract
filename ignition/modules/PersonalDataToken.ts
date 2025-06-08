import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import * as dotenv from "dotenv";
dotenv.config();

const PersonalDataTokenModule = buildModule("PersonalDataTokenModule", (m) => {
    // 파라미터 설정 (실제 배포 시 값 변경 필요)
    const teamWallet = m.getParameter(
        "teamWallet", 
        process.env.TEAM_WALLET || "" // 기본값: 실제 지갑 주소 입력
    );
    const investorWallet = m.getParameter(
        "investorWallet", 
        process.env.INVESTOR_WALLET || "" // 기본값: 실제 지갑 주소 입력
    );
    const operatorWallet = m.getParameter(
        "operatorWallet", 
        process.env.OPERATOR_WALLET || "" // 기본값: 실제 지갑 주소 입력
    );

    // 생성자 파라미터 전달
    const pdtToken = m.contract("PersonalDataToken", [teamWallet, investorWallet]);

    return { pdtToken };
});

export default PersonalDataTokenModule;