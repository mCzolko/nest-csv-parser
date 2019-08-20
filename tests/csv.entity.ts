export class CsvEntity {

  foo: string;

  bar: string;

  constructor(partial: Partial<CsvEntity>) {
    Object.assign(this, partial);
  }

}
