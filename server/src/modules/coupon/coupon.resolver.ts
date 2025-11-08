import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CouponService } from './coupon.service';
import { Coupon } from 'src/graphql/@generated/coupon/coupon.model';
import { CouponCreateInput } from 'src/graphql/@generated/coupon/coupon-create.input';
import { CouponWhereInput } from 'src/graphql/@generated/coupon/coupon-where.input';
import { CouponUpdateInput } from 'src/graphql/@generated/coupon/coupon-update.input';

@Resolver(() => Coupon)
export class CouponResolver {
  constructor(private readonly couponService: CouponService) {}

  @Mutation(() => Coupon)
  createCoupon(
    @Args('createCouponInput') createCouponInput: CouponCreateInput,
  ) {
    return this.couponService.create(createCouponInput);
  }

  @Query(() => [Coupon], { name: 'coupons' })
  findAll(@Args('where', { nullable: true }) where: CouponWhereInput) {
    return this.couponService.findAll(where);
  }

  @Query(() => Coupon, { name: 'coupon' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.couponService.findOne(id);
  }

  @Mutation(() => Coupon)
  updateCoupon(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateCouponInput') updateCouponInput: CouponUpdateInput,
  ) {
    return this.couponService.update(id, updateCouponInput);
  }

  @Mutation(() => Coupon)
  validateCoupon(@Args('coupon') coupon: string) {
    return this.couponService.validateCoupon(coupon);
  }

  @Mutation(() => Coupon)
  removeCoupon(@Args('id', { type: () => Int }) id: number) {
    return this.couponService.remove(id);
  }
}
