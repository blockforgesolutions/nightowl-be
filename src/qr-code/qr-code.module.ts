import { Module } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.QR_SECRET || 'defaultSecretKey',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  providers: [QrCodeService],
  exports: [QrCodeService],
})
export class QrCodeModule { }
