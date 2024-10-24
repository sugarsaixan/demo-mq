import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller('subscriber')
export class SubscriberController {
    
    @EventPattern('message_printed')
    handleMessagePrinted(@Payload() data: any) {
        console.log(`Message received: ${JSON.stringify(data)}`);
    }
}
