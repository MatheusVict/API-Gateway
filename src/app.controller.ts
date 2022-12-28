import { Controller, Logger } from '@nestjs/common';

@Controller('api/v1/category')
export class AppController {
  private readonly logger = new Logger(AppController.name);
}
