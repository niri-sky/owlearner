import { Test, TestingModule } from '@nestjs/testing';
import { CouponResolver } from './coupon.resolver';
import { CouponService } from './coupon.service';

describe('CouponResolver', () => {
  let resolver: CouponResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponResolver, CouponService],
    }).compile();

    resolver = module.get<CouponResolver>(CouponResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
