import { Controller, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiOperation, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { PaymentMessages } from 'src/payment/enums/payment-message.enum';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
    constructor(
        private readonly paymentService: PaymentService
    ) { }

    @Post('create-session')
    @UseGuards(JwtAuthGuard)
    @ApiSecurity('bearer')
    @ApiOperation({ summary: 'Create a payment session', description: 'Returns a payment session id' })
    @ApiResponse({
        status: 201,
        description: PaymentMessages.CREATED,
        type: String
    })
    @ApiResponse({ status: 400, description: PaymentMessages.INVALID_CREDENTIALS })
    @ApiResponse({ status: 401, description: PaymentMessages.UNAUTHORIZED_ACCESS })
    async createPaymentSession() {
        return this.paymentService.createPaymentSession();
    }

    @Post('webhook')
    @ApiOperation({ summary: 'Handle a payment webhook' })
    async handleWebhook() {
        await this.paymentService.handleWebhook();
        return { received: true };
    }
}
