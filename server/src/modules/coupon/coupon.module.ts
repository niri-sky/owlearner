import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CouponResolver } from './coupon.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [CouponResolver, CouponService, DatabaseService],
})
export class CouponModule {}
