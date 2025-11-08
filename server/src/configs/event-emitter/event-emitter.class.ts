import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

export interface EventPayloads {
  'admin.invite': { email: string; name: string; link: string };
  'organization.invite': { email: string; name: string; link: string };
  'teacher.invite': { email: string; name: string; link: string };
  'email.verify': { email: string; name: string; code: string };
  'password.request': { email: string; name: string; link: string };
  'teacher.approved': { email: string; name: string; link: string };
  'organization.approved': { email: string; name: string; link: string };
  'student.banned': { email: string; name: string };
  'student.unbanned': { email: string; name: string; link: string };
}

@Injectable()
export class TypedEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  emit<K extends keyof EventPayloads>(
    event: K,
    payload: EventPayloads[K],
  ): boolean {
    return this.eventEmitter.emit(event, payload);
  }
}
