import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as QRCode from 'qrcode'

interface QRResponse {
    qr: string;
    qrToken:string
}

@Injectable()
export class QrCodeService {

    constructor(
        private readonly jwtService: JwtService
    ) { }

    async generateQR(payload: any): Promise<QRResponse> {

        const qrToken = this.jwtService.sign(payload, { secret: process.env.QR_SECRET || 'defaultSecretKey' });

        const qrLink = `http://localhost:8080/api/ticket/verify-ticket?token=${qrToken}`;

        const qr: string = await QRCode.toDataURL(qrLink);

        return { qr, qrToken };
    }

}
