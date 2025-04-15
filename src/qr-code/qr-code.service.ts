import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as QRCode from 'qrcode'

@Injectable()
export class QrCodeService {

    constructor(
        private readonly jwtService: JwtService
    ) {}

    async generateQR(payload: any): Promise<string> {

        const qrToken = this.jwtService.sign(payload, { secret: process.env.QR_SECRET || 'defaultSecretKey' });

        const qr:string = await QRCode.toDataURL(qrToken);
        
        return qr;
    }

}
