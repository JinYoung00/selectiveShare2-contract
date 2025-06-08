import { Injectable } from '@nestjs/common';
import { ethers } from "ethers";
import { abi } from "../abi/contract.json"; 
import * as dotenv from "dotenv";
dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || ""
const PROVIDER_URL = process.env.PROVIDER_URL || "http://localhost:8545"; 
const OPERATOR_PRIVATE = process.env.OPERATOR_PRIVATE || "";

@Injectable()
export class Contract {
  static callStateChangingFunction(userAddress: string, arg1: number) {
    throw new Error('Method not implemented.');
  }
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(PROVIDER_URL);

    this.contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      this.provider,
    );

  }

  async getBalanceOf(userAddress: string): Promise<any> {
    return await this.contract.getBalanceOf(userAddress);
  }

  async rewardUser(userAddress: string, actionType: number): Promise<any> {
    const wallet = new ethers.Wallet(OPERATOR_PRIVATE, this.provider);
    const signer = this.provider.getSigner(wallet.address);
    const contractWithSigner = this.contract.connect(await signer) as any; 
    return await contractWithSigner.rewardUser(userAddress, actionType);
  }

  async getRewardHistory(userAddress: string): Promise<any> {
    return await this.contract.getRewardHistory(userAddress);
  }
}
