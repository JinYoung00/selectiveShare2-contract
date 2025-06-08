import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('balance/:userAddress')
  getBalanceOf(@Param('userAddress') userAddress: string): Promise<any> {
    return this.appService.getBalanceOf(userAddress);
  }

  @Post('users/:userAddress/rewards')
  rewardUser(
    @Param('userAddress') userAddress: string,
    @Body() body: { type: number; signature: string }
  ): Promise<any> {
    return this.appService.rewardUser(userAddress, body.type, body.signature);
  }
}
