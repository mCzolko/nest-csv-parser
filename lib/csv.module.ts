import { Module } from '@nestjs/common';
import { CsvParser } from './csv.parser';

@Module({
  providers: [CsvParser],
  exports: [CsvParser],
})
export class CsvModule {}
