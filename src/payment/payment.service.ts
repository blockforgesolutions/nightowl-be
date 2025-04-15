import { Injectable } from '@nestjs/common';
import { WebhookDto } from './dto/webhook.dto';
import { TicketService } from 'src/ticket/ticket.service';
@Injectable()
export class PaymentService {
    constructor(
        private readonly ticketService: TicketService
    ) { }

    // eslint-disable-next-line @typescript-eslint/require-await
    async createPaymentSession(): Promise<string> {
        // const enrollment = await this.enrollmentModel.findById(enrollmentId).lean();
        // console.log(enrollment);

        // if (!enrollment) {
        //     throw new BadRequestException('Kayıt bulunamadı');
        // }

        // payment service configurations

        // notification to user

        return `mock_session_${Math.random().toString(36).substring(7)}`;
    }

    async handleWebhook(data: WebhookDto): Promise<void> {
        await this.ticketService.createTicket(data);
    }
}
