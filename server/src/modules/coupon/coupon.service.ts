import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { CouponCreateInput } from 'src/graphql/@generated/coupon/coupon-create.input';
import { CouponUpdateInput } from 'src/graphql/@generated/coupon/coupon-update.input';
import { CouponWhereInput } from 'src/graphql/@generated/coupon/coupon-where.input';

@Injectable()
export class CouponService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CouponCreateInput) {
    const coupon = await this.databaseService.coupon.create({
      data: input as any,
    });

    return coupon;
  }

  async findAll(input: CouponWhereInput) {
    const coupons = this.databaseService.coupon.findMany({
      where: input as any,
      include: { couponUsed: { include: { student: true } } },
    });
    return coupons;
  }

  findOne(id: number) {
    return `This action returns a #${id} coupon`;
  }

  async update(id: number, updateCouponInput: CouponUpdateInput) {
    const coupon = this.databaseService.coupon.update({
      where: { id },
      data: updateCouponInput as any,
    });
    return coupon;
  }

  async remove(id: number) {
    const coupon = await this.databaseService.coupon.delete({ where: { id } });
    return coupon;
  }

  async validateCoupon(c: string) {
    const coupon = await this.databaseService.coupon.findFirst({
      where: { code: c },
    });
    if (!coupon) throw new NotFoundException('Coupon not valid');

    return coupon;
  }
}
