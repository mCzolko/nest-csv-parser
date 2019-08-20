import { CsvKey } from '../../src/csvkey.decorator';
import { Type as CsvType } from 'class-transformer';

export class CsvEntityRemaped {

  @CsvKey('foo')
  @CsvType(() => Number)
  id: number;

  @CsvKey('bar')
  value: string;

  nothing: string;

  constructor(partial: Partial<CsvEntityRemaped>) {
    Object.assign(this, partial);
  }

}
