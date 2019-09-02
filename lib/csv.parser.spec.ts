// tslint:disable-next-line:no-var-requires
const fs = require('fs');
import { Test, TestingModule } from '@nestjs/testing';
import { CsvParser } from './csv.parser';
import { CsvEntity } from '../tests/csv.entity';
import { CsvEntityRemaped } from '../tests/csv.entity.remaped';

describe('CsvParser', () => {
  let csvParser: CsvParser;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [CsvParser],
    }).compile();

    csvParser = app.get<CsvParser>(CsvParser);
  });

  describe('parse simple', () => {

    it('should return list of 2', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity);

      expect(entities.list.length).toBe(2);
      expect(entities.total).toBe(2);
    });

    it('keys should be 2 on both entities', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity);

      expect(Object.keys(entities.list[0]).length).toBe(2);
      expect(Object.keys(entities.list[1]).length).toBe(2);
    });

    it('entities should be instance of CsvEntity', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity);

      expect(entities.list[0]).toBeInstanceOf(CsvEntity);
      expect(entities.list[1]).toBeInstanceOf(CsvEntity);
    });

    it('should return list of correct entities', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity);
      const csv1 = new CsvEntity({ foo: '1', bar: 'a' });
      const csv2 = new CsvEntity({ foo: '2', bar: 'b' });

      expect(entities.list[0]).toStrictEqual(csv1);
      expect(entities.list[1]).toStrictEqual(csv2);
    });

    it('should return list of first entity', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity, 1);
      const csv1 = new CsvEntity({ foo: '1', bar: 'a' });

      expect(entities.list[0]).toStrictEqual(csv1);
    });

    it('should return list of first entity', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity, 1, 1);
      const csv2 = new CsvEntity({ foo: '2', bar: 'b' });

      expect(entities.list[0]).toStrictEqual(csv2);
    });

    it('should return list of 2 separated by commma', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/simple.comma-separated.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity, null, null, { separator: ',' });

      expect(entities.list.length).toBe(2);
      expect(entities.total).toBe(2);
    });

  });

  describe('parse invalid', () => {

    it('should reject an error', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/invalid.csv');
      await expect(csvParser.parse(csvStream, CsvEntity))
        .rejects
        .toStrictEqual({ errors: [
          RangeError('Row length does not match headers'),
        ] });
    });

  });

  describe('parse invalid multiple', () => {

    it('should reject 2 errors', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/invalid.multiple.csv');
      await expect(csvParser.parse(csvStream, CsvEntity))
        .rejects
        .toStrictEqual({ errors: [
          RangeError('Row length does not match headers'),
          RangeError('Row length does not match headers'),
        ] });
    });

  });

  describe('parse quoted', () => {

    it('should cleanup quotes', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/quoted.csv');
      const entities = await csvParser.parse(csvStream, CsvEntity);
      const csv1 = new CsvEntity({ foo: '1', bar: 'a' });
      const csv2 = new CsvEntity({ foo: '2', bar: 'b' });

      expect(entities.list[0]).toStrictEqual(csv1);
      expect(entities.list[1]).toStrictEqual(csv2);
    });

  });

  describe('parse remaped', () => {

    it('should remap keys and cast type', async () => {
      const csvStream = fs.createReadStream(__dirname + '/../tests/remaped.csv');
      const entities = await csvParser.parse(csvStream, CsvEntityRemaped);
      const csv1 = new CsvEntityRemaped({ id: 1, value: 'a', nothing: 'x' });
      const csv2 = new CsvEntityRemaped({ id: 2, value: 'b', nothing: 'y' });

      expect(entities.list[0]).toStrictEqual(csv1);
      expect(entities.list[1]).toStrictEqual(csv2);
    });

  });

});
