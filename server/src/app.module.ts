import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DatabaseModule } from './configs/database/database.module';
import { EmailModule } from './configs/email/email.module';
import { TypedEventEmitterModule } from './configs/event-emitter/event-emitter.module';
import { MuxModule } from './configs/mux/mux.module';
import { PubsubModule } from './configs/pubsub/pubsub.module';
import { StripeModule } from './configs/stripe/stripe.module';
import { TokenModule } from './configs/token/token.module';
import { AdminModule } from './modules/admin/admin.module';
import { CategoryModule } from './modules/category/category.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { CourseModule } from './modules/course/course.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PostModule } from './modules/post/post.module';
import { SaleModule } from './modules/sale/sale.module';
import { StudentModule } from './modules/student/student.module';
import { TeacherModule } from './modules/teacher/teacher.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { UploadModule } from './modules/upload/upload.module';
import { StripeConnectModule } from './modules/stripe-connect/stripe-connect.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
      subscriptions: {
        'graphql-ws': {
          path: '/subscriptions',
        },
      },
    }),
    DatabaseModule,
    EmailModule,
    TokenModule,
    TypedEventEmitterModule,
    EventEmitterModule.forRoot(),
    // start module from here
    AdminModule,
    TeacherModule,
    OrganizationModule,
    StudentModule,
    CourseModule,
    TicketModule,
    MuxModule,
    UploadModule,
    CouponModule,
    CategoryModule,
    PostModule,
    PaymentModule,
    StripeModule,
    InvoiceModule,
    NotificationModule,
    SaleModule,
    PubsubModule,
    StripeConnectModule, // Stripe Connect for automated payouts
  ],
})
export class AppModule {}
