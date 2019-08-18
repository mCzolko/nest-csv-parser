// tslint:disable-next-line:no-var-requires
const fs = require('fs');
import { Test, TestingModule } from '@nestjs/testing';
import { AppParser } from './app.parser';
import { CsvEntity } from '../test/csv/csv.entity';
import { CsvEntityRemaped } from '../test/csv/csv.entity.remaped';

describe('AppParser', () => {
  let appParser: AppParser;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppParser],
    }).compile();

    appParser = app.get<AppParser>(AppParser);
  });

  describe('parse simple', () => {

    it('should return list of 2', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/simple.csv');
      const entities = await appParser.parse(csvStream, CsvEntity);

      expect(entities.list.length).toBe(2);
      expect(entities.total).toBe(2);
    });

    it('keys should be 2 on both entities', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/simple.csv');
      const entities = await appParser.parse(csvStream, CsvEntity);

      expect(Object.keys(entities.list[0]).length).toBe(2);
      expect(Object.keys(entities.list[1]).length).toBe(2);
    });

    it('entities should be instance of CsvEntity', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/simple.csv');
      const entities = await appParser.parse(csvStream, CsvEntity);

      expect(entities.list[0]).toBeInstanceOf(CsvEntity);
      expect(entities.list[1]).toBeInstanceOf(CsvEntity);
    });

    it('should return list of correct entities', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/simple.csv');
      const entities = await appParser.parse(csvStream, CsvEntity);
      const csv1 = new CsvEntity({ foo: '1', bar: 'a' });
      const csv2 = new CsvEntity({ foo: '2', bar: 'b' });

      expect(entities.list[0]).toStrictEqual(csv1);
      expect(entities.list[1]).toStrictEqual(csv2);
    });

  });

  describe('parse invalid', () => {

    it('should reject an error', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/invalid.csv');
      await expect(appParser.parse(csvStream, CsvEntity))
        .rejects
        .toStrictEqual({ errors: [ Error('Line 2 is invalid; number of keys: 3; number of values 2') ] });
    });

  });

  describe('parse invalid multiple', () => {

    it('should reject 2 errors', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/invalid.multiple.csv');
      await expect(appParser.parse(csvStream, CsvEntity))
        .rejects
        .toStrictEqual({ errors: [
          Error('Line 2 is invalid; number of keys: 3; number of values 2'),
          Error('Line 4 is invalid; number of keys: 3; number of values 2'),
        ] });
    });

  });

  describe('parse quoted', () => {

    it('should cleanup quotes', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/quoted.csv');
      const entities = await appParser.parse(csvStream, CsvEntity);
      const csv1 = new CsvEntity({ foo: '1', bar: 'a' });
      const csv2 = new CsvEntity({ foo: '2', bar: 'b' });

      expect(entities.list[0]).toStrictEqual(csv1);
      expect(entities.list[1]).toStrictEqual(csv2);
    });

  });

  describe('parse remaped', () => {

    it('should remap keys', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../test/csv/simple.csv');
      const entities = await appParser.parse(csvStream, CsvEntityRemaped);
      const csv1 = new CsvEntityRemaped({ id: 1, value: 'a' });
      const csv2 = new CsvEntityRemaped({ id: 2, value: 'b' });

      expect(entities.list[0]).toStrictEqual(csv1);
      expect(entities.list[1]).toStrictEqual(csv2);
    });

  });

});
