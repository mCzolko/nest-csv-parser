// tslint:disable-next-line:no-var-requires
const csv = require('csv-parser');
import { plainToClass, classToPlain } from 'class-transformer';
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
      let i = 0;
      let c = 0;
      const list = [];
      const errors = [];

      const pipedStream = stream.pipe(csv({
        strict: true,
        separator: ';',
      }));

      pipedStream.on('error', (e) => {
        errors.push(e);

        reject({ errors });
      });

      pipedStream.on('data', line => {
        i++;

        if (count) {
          if (c >= count) {
            return;
          }

          if (offset && (i - 1) < offset) {
            return;
          }

          c++;
        }

        const procesedLine = this.processLine(i, line, Entity);
        list.push(procesedLine);
      });

      pipedStream.on(
        'end',
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

  processLine(index: number, line: any, Entity): any {
    /*
    const plain = {};
    keys.forEach((key: string, i: number) => {
      const plainKey = key;
      console.log(key, getCsvKey(new Entity(), key));
      // plain[plainKey] = lineSplitted[i];
    });
    */

    const plain = classToPlain(line);

    return plainToClass(Entity, plain);
  }

}
