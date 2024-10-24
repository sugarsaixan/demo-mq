import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SubscriberController } from './subscriber/subscriber.controller';
import { PublisherService } from './publisher/publisher.service';

@Module({
  imports: [
    // RabbitMQ client setup
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'], // Replace with your RabbitMQ URL if different
          queue: 'nest_queue', // Define the queue name
          queueOptions: {
            durable: false, // Set to true for a persistent queue
          },
        },
      },
    ]),
  ],
  controllers: [AppController, SubscriberController],
  providers: [AppService, PublisherService],
})
export class AppModule {}
