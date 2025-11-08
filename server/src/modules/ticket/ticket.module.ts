import { NotificationService } from '../notification/notification.service';
import { Module } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { TicketResolver } from './ticket.resolver';
import { DatabaseService } from 'src/configs/database/database.service';

@Module({
  providers: [
    TicketResolver,
    TicketService,
    DatabaseService,
    NotificationService,
  ],
})
export class TicketModule {}
