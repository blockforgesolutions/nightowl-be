import { Injectable } from '@nestjs/common';
@Injectable()
export class PaymentService {
    constructor(
        
    ) {}

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

    async handleWebhook(): Promise<void> {
        // const mockTransactionId = 'mock_transaction_id';
        
    }
}
