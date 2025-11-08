import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TicketService } from './ticket.service';
import { Ticket } from 'src/graphql/@generated/ticket/ticket.model';
import { TicketCreateInput } from 'src/graphql/@generated/ticket/ticket-create.input';
import { TicketUpdateInput } from 'src/graphql/@generated/ticket/ticket-update.input';
import { TicketWhereInput } from 'src/graphql/@generated/ticket/ticket-where.input';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly ticketService: TicketService) {}

  @Mutation(() => Ticket)
  createTicket(
    @Args('createTicketInput') createTicketInput: TicketCreateInput,
  ) {
    return this.ticketService.create(createTicketInput);
  }

  @Query(() => [Ticket], { name: 'tickets' })
  findAll(@Args('query', { nullable: true }) query: TicketWhereInput) {
    return this.ticketService.findAll(query);
  }

  @Query(() => Ticket, { name: 'ticket' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.ticketService.findOne(id);
  }

  @Mutation(() => Ticket)
  updateTicket(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateTicketInput') updateTicketInput: TicketUpdateInput,
  ) {
    return this.ticketService.update(id, updateTicketInput);
  }

  @Mutation(() => Ticket)
  removeTicket(@Args('id', { type: () => Int }) id: number) {
    return this.ticketService.remove(id);
  }
}
