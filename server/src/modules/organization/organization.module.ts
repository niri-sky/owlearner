import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { DatabaseService } from 'src/configs/database/database.service';
import { TokenService } from 'src/configs/token/token.service';
import { NotificationService } from '../notification/notification.service';
import { PubsubService } from 'src/configs/pubsub/pubsub.service';

@Module({
  providers: [
    OrganizationResolver,
    OrganizationService,
    DatabaseService,
    TokenService,
    NotificationService,
  ],
})
export class OrganizationModule {}
