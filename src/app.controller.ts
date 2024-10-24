import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublisherService } from './publisher/publisher.service';

@Controller()
export class AppController {
  constructor(
    private readonly publisherService: PublisherService,
  ) {}

  @Get('publish')
  async publish () {
    const message = { text: 'Hello from RabbitMQ!' };
    await this.publisherService.publishMessage(message);
    return 'Message sent to RabbitMQ!';
  }
}
