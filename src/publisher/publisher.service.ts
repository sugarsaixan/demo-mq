import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
// Publisher (Producer) service
@Injectable()
export class PublisherService {
    constructor(
        @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    ) {}

    async publishMessage(data: any) {
        console.log(`Publishing message: ${JSON.stringify(data)}`);
        this.client.emit('message_printed', data);
    }
}
