import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppJapanService {
  constructor(
    @Inject('APP_NAME')
    private readonly name: string,
    @Inject('APP_JAPAN_NAME')
    private readonly message: string,
  ) {}
  getHello(): string {
    console.log(process.env.DB_HOST);
    return `こんにちは、世界！from ${this.name}, ��し方：${this.message} です`;
  }
}
