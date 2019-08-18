// tslint:disable-next-line:no-var-requires
const readline = require('readline');
import { plainToClass } from 'class-transformer';
import { Injectable } from '@nestjs/common';
import { getCsvKey } from './csvkey.decorator';

export interface ParsedData<T> {
  list: T[];
  total: number;
  count: number|null;
  offset: number|null;
}

@Injectable()
export class AppParser {
  async parse(stream, Entity, count: number = null, offset: number = null): Promise<ParsedData<InstanceType<typeof Entity>>> {
    return new Promise((resolve, reject) => {
      let i = -1;
      let c = 0;
      let keys = [];
      const list = [];
      const errors = [];

      const lineReader = readline.createInterface({ input: stream });

      lineReader.on('line', line => {
        i++;
        const firstLine = i === 0;

        // Get the keys first
        if (firstLine) {
          keys = line.split(';').map(this.removeQuotes);
          return;
        }

        if (count) {
          if (c >= count) {
            return;
          }

          if (offset && (i - 1) < offset) {
            return;
          }

          c++;
        }

        try {
          const procesedLine = this.processLine(i, keys, line, Entity);
          list.push(procesedLine);
        } catch (e) {
          errors.push(e);
        }
      });

      lineReader.on(
        'close',
        () => errors.length > 0 ?
          reject({ errors })
        :
          resolve({
            list,
            count,
            offset,
            total: i,
          }),
      );
    });
  }

  removeQuotes(cell: string) {
    if (cell[0] === '"' && cell[cell.length - 1] === '"') {
      return cell.slice(1, -1);
    }

    return cell;
  }

  processLine(index: number, keys: any, line: any, Entity): any {
    const lineSplitted = line.split(';').map(this.removeQuotes);

    if (keys.length !== lineSplitted.length) {
      throw new Error(`Line ${index} is invalid; number of keys: ${keys.length}; number of values ${lineSplitted.length}`);
    }

    const plain = {}; // toObject(keys, lineSplitted);

    keys.forEach((key: string, i: number) => {
      const plainKey = key;
      console.log(key, getCsvKey(new Entity(), key));
      plain[plainKey] = lineSplitted[i];
    });

    return plainToClass(Entity, plain);
  }

}
