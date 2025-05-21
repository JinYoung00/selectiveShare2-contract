import { Injectable } from '@nestjs/common';
import { Contract } from './app.contract';

@Injectable()
export class AppService {
  constructor (private readonly contract: Contract) {}
  
  getHello(): string {

    var userAddress = '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E';
    this.contract.rewardForDataSubmission(userAddress, 0).then(
      (result) => {
        console.log('Transaction result:', result);
      },
      (error) => {
        console.error('Error calling contract function:', error);
      },
    );
    return 'Hello World!';
  }
}
