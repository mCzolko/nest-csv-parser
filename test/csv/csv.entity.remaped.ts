import { CsvKey } from '../../src/csvkey.decorator';

export class CsvEntityRemaped {

  @CsvKey('foo')
  id: number;

  @CsvKey('bar')
  value: string;

  nothing: string;

  constructor(partial: Partial<CsvEntityRemaped>) {
    Object.assign(this, partial);
  }

}
