Here’s a `README.md` file template for the simple NestJS app using RabbitMQ for publishing and subscribing to messages:

---

# NestJS RabbitMQ Publisher-Subscriber Example

This project demonstrates how to implement a simple **publisher-subscriber** architecture using **RabbitMQ** and **NestJS microservices**.

## Features

- **Publisher**: Sends messages to RabbitMQ.
- **Subscriber**: Listens for messages from RabbitMQ and processes them.
- **RabbitMQ Integration**: Uses RabbitMQ as the messaging broker.
- **Management UI**: Includes RabbitMQ management interface for monitoring.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v12 or higher)
- [Docker](https://www.docker.com/) (for running RabbitMQ in a container)
- [RabbitMQ](https://www.rabbitmq.com/) (you can either install locally or use Docker)

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:sugarsaixan/demo-mq.git
   cd demo-mq
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Run RabbitMQ using Docker:

   ```bash
   docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
   ```

   - RabbitMQ management UI will be available at: `http://localhost:15672`
   - Default RabbitMQ credentials:  
     - Username: `guest`  
     - Password: `guest`

## Running the Application

To start the application with both HTTP and RabbitMQ microservice:

```bash
npm run start
```

The application will run on `http://localhost:3000`.

## Usage

1. **Publish a Message:**

   You can trigger the publishing of a message by visiting this URL in your browser or using `curl`:

   ```bash
   http://localhost:3000/publish
   ```

   The publisher sends a message to RabbitMQ, and the subscriber listens to it.

2. **Check the Logs:**

   You should see the following message logged in your terminal by the subscriber when the message is received:

   ```
   Message received: { text: 'Hello from RabbitMQ!' }
   ```

3. **Access the RabbitMQ Management UI:**

   You can monitor the RabbitMQ queue and messages using the RabbitMQ Management UI at `http://localhost:15672`. After publishing a message, you can check if the queue `nest_queue` exists and observe the message flow.

## Project Structure

```bash
src/
├── app.controller.ts      # Defines a simple controller to trigger message publishing
├── app.module.ts          # Main module where RabbitMQ microservices are configured
├── publisher/publisher.service.ts   # Publishes messages to RabbitMQ
├── subscriber/subscriber.controller.ts # Subscribes to messages from RabbitMQ
├── main.ts                # Application bootstrap (starts both HTTP server and microservice)
```

## Code Explanation

### Publisher

- The publisher sends a message to RabbitMQ via the `publishMessage` method in `PublisherService`.

```typescript
// publisher.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PublisherService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
  ) {}

  async publishMessage(data: any) {
    this.client.emit('message_printed', data);  // Sending message to RabbitMQ
  }
}
```

### Subscriber

- The subscriber listens for messages on the `message_printed` event and processes them.

```typescript
// subscriber.controller.ts
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class SubscriberController {
  @EventPattern('message_printed')
  handleMessagePrinted(@Payload() data: any) {
    console.log('Message received:', data);  // Processing the message
  }
}
```

### Microservice Configuration

In `main.ts`, the RabbitMQ microservice is set up and connected to a queue `nest_queue`.

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const microservice = app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'nest_queue',
      queueOptions: { durable: false },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);  // HTTP server
}
bootstrap();
```

## Running Tests

You can run the unit tests using the following command:

```bash
npm run test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Notes:
- If you're using a remote RabbitMQ instance or a different port, update the RabbitMQ URL in the microservice configuration.
- The queue name is set to `nest_queue`. You can change this as per your requirements.