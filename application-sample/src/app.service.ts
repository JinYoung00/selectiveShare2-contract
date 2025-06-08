import { Injectable } from '@nestjs/common';
import { Contract } from './app.contract';
import { ethers, verifyMessage, keccak256 } from "ethers";

@Injectable()
export class AppService {
  constructor (private readonly contract: Contract) {}
  
  getBalanceOf(userAddress): Promise<any> {
    return this.contract.getBalanceOf(userAddress);
  }
  rewardUser(userAddress, type, signature): Promise<any> {
      if(!userAddress || type === undefined || !signature) {
        throw new Error('Invalid parameters');
      }
      if(!ethers.isAddress(userAddress)) {
        throw new Error('Invalid user address');
      }
      if(!Number.isInteger(type) || type < 0 || type > 2) {
        throw new Error('Invalid action type');
      }
      // if(type == 0){
      //   // 1. 서명된 메시지 생성
      //   // userAddress와 type을 사용하여 메시지 생성
      //   // type이 0인 경우에만 서명 검증을 수행
      //   if (!signature) {
      //     throw new Error('Signature is required for action type 0');
      //   }
      //   const message = keccak256(encodePacked(['address', 'uint256'], [userAddress, type]));
      //   const recoveredAddress = verifyMessage(arrayify(message), signature);
      //   if (recoveredAddress.toLowerCase() !== userAddress.toLowerCase()) {
      //     throw new Error('Invalid signature');
      //   }
      // }
      const res = this.contract.rewardUser(userAddress, type);
    return res;
  }
}
