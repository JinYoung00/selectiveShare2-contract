import { Injectable } from '@nestjs/common';
import { ethers } from "ethers";
import { abi } from "../abi/contract.json"; // abi 파일 경로

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // 실제 배포 주소
const PROVIDER_URL = 'http://localhost:8545'; // 로컬 하드햇 노드

@Injectable()
export class Contract {
  static callStateChangingFunction(userAddress: string, arg1: number) {
    throw new Error('Method not implemented.');
  }
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(PROVIDER_URL);

    // 읽기 전용 인스턴스 (view 함수만 호출 가능)
    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      this.provider,
    );
  }

  //읽기 전용
  async getBalanceOf(userAddress: string): Promise<any> {
    return await this.contract.getBalanceOf(userAddress);
  }

  //상태 변경(트랜잭션)
  async rewardForDataSubmission(userAddress: string, type: number): Promise<any> {
    // 트랜잭션을 보내는 signer 준비 (테스트용 첫 번째 계정)
    const signer = this.provider.getSigner(userAddress); //로컬에서만 유효, 프론트에서 메타마스크로 서명해야 함
    const contractWithSigner = this.contract.connect(await signer) as any; //Typechain으로 생성된 타입이 없으므로 any로 처리
    return await contractWithSigner.rewardForDataSubmission(userAddress, type);
  }
}
