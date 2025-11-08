import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/configs/database/database.service';
import { CourseSaleCreateManyInput } from 'src/graphql/@generated/course-sale/course-sale-create-many.input';
import { CourseSaleCreateInput } from 'src/graphql/@generated/course-sale/course-sale-create.input';
import { CourseSaleUpdateInput } from 'src/graphql/@generated/course-sale/course-sale-update.input';
import { PaymentInvoiceUpdateInput } from 'src/graphql/@generated/payment-invoice/payment-invoice-update.input';
import { PaymentInvoiceWhereInput } from 'src/graphql/@generated/payment-invoice/payment-invoice-where.input';
import { WithdrawRequestInput } from 'src/graphql/custom/withdraw-input';

@Injectable()
export class SaleService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(input: CourseSaleCreateInput) {
    const courseSale = await this.databaseService.courseSale.create({
      data: input as any,
    });

    return courseSale;
  }

  async createMany(input: CourseSaleCreateManyInput[]) {
    const courseSale = await this.databaseService.courseSale.createMany({
      data: input as any,
    });

    return {
      status: 'Success',
    };
  }

  async findAll() {
    const courseSales = await this.databaseService.courseSale.findMany({
      include: {
        course: true,
        student: true,
        teacherEarning: true,
      },
    });

    return courseSales;
  }

  async findOne(id: number) {
    const courseSale = await this.databaseService.courseSale.findUnique({
      where: { id },
    });
    return courseSale;
  }

  async update(id: number, input: CourseSaleUpdateInput) {
    const courseSale = await this.databaseService.courseSale.update({
      where: { id },
      data: input as any,
    });
    return courseSale;
  }

  async remove(id: number) {
    const courseSale = await this.databaseService.courseSale.delete({
      where: { id },
    });
    return courseSale;
  }

  async findTeacherEarning(teacherId: number) {
    const teacherEarning = await this.databaseService.teacherEarning.findUnique(
      {
        where: {
          teacherId: teacherId,
        },
        include: {
          sales: true,
          paymentInvoices: true,
          teacher: true,
        },
      },
    );

    return teacherEarning;
  }

  async findOrganizationEarning(organizationId: number) {
    const organizationEarning =
      await this.databaseService.organizationEarning.findUnique({
        where: {
          organizationId,
        },
        include: {
          teachersEarnings: {
            include: {
              paymentInvoices: true,
              sales: true,
            },
          },
          paymentInvoices: true,
        },
      });

    return organizationEarning;
  }

  async requestTeacherWithdraw(input: WithdrawRequestInput) {
    const teacher = await this.databaseService.teacher.findUnique({
      where: { id: input.id },
      include: {
        organization: {
          include: {
            organizationEarning: true,
          },
        },
        teacherEarning: {
          include: {
            sales: true,
          },
        },
      },
    });

    if (!teacher) throw new NotFoundException('Teacher not found');
    const teacherEarning = teacher.teacherEarning;
    if (!teacherEarning)
      throw new NotFoundException('Teacher Earning not found');

    const totalAmount =
      teacherEarning.sales.reduce((a, v) => a + v.price, 0) -
      teacherEarning.withdraw;

    if (totalAmount < input.amount)
      throw new NotFoundException('Not enough money to withdraw');

    const te = await this.databaseService.teacherEarning.update({
      where: { id: teacherEarning.id },
      data: {
        withdraw: teacherEarning.withdraw + input.amount,
        paymentInvoices: {
          create: Object.assign(
            {
              amount: input.amount,
              bankDetails: input.bankDetails,
              to: teacher.organization ? 'organization' : 'admin',
              userType: 'teacher',
              status: 'pending',
              teacher: {
                connect: {
                  id: teacher.id,
                },
              },
            },
            teacher.organization && {
              organization: {
                connect: {
                  id: teacher.organization.id,
                },
              },
              organizationEarnings: {
                connect: {
                  id: teacher.organization.organizationEarning.id,
                },
              },
            },
          ) as any,
        },
      },
    });

    return {
      status: 'Success',
    };
  }

  async requestOrganizationWithdraw(input: WithdrawRequestInput) {
    const organization = await this.databaseService.organization.findUnique({
      where: { id: input.id },
      include: {
        organizationEarning: {
          include: {
            teachersEarnings: {
              include: {
                sales: true,
              },
            },
          },
        },
      },
    });

    if (!organization) throw new NotFoundException('Organization not found');
    const organizationEarning = organization.organizationEarning;
    if (!organizationEarning)
      throw new NotFoundException('Organization Earning not found');

    const allSales = organizationEarning.teachersEarnings.flatMap(
      (v) => v.sales,
    );

    console.log(organizationEarning);

    const totalAmount =
      allSales.reduce((a, v) => a + v.price, 0) - organizationEarning.withdraw;

    if (totalAmount < input.amount)
      throw new NotFoundException('Not enough money to withdraw');

    const te = await this.databaseService.organizationEarning.update({
      where: { id: organizationEarning.id },
      data: {
        withdraw: organizationEarning.withdraw + input.amount,
        paymentInvoices: {
          create: {
            amount: input.amount,
            bankDetails: input.bankDetails,
            to: 'admin',
            userType: 'organization',
            status: 'pending',
            organization: {
              connect: {
                id: organization.id,
              },
            },
          },
        },
      },
    });

    return {
      status: 'Success',
    };
  }

  async findPaymentInvoices(where: PaymentInvoiceWhereInput) {
    const paymentInvoices = await this.databaseService.paymentInvoice.findMany({
      where: where as any,
      include: {
        organization: true,
        teacher: true,
      },
    });

    return paymentInvoices;
  }
  async updatePaymentInvoices(id: number, input: PaymentInvoiceUpdateInput) {
    const paymentInvoices = await this.databaseService.paymentInvoice.update({
      where: { id },
      data: input as any,
      include: {
        organization: true,
        teacher: true,
      },
    });

    return paymentInvoices;
  }
}
