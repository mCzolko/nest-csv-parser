<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>
    <p align="center">
<a href="https://www.npmjs.com/package/nest-csv-parser"><img src="https://img.shields.io/npm/v/nest-csv-parser.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/package/nest-csv-parser"><img src="https://img.shields.io/npm/l/nest-csv-parser.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/package/nest-csv-parser"><img src="https://img.shields.io/npm/dm/nest-csv-parser.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/mCzolko/nest-csv-parser"><img src="https://circleci.com/gh/mCzolko/nest-csv-parser.svg?style=svg" alt="CircleCI Builds" /></a>
<a href='https://coveralls.io/github/mCzolko/nest-csv-parser?branch=master'><img src='https://coveralls.io/repos/github/mCzolko/nest-csv-parser/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

# CSV Parser for NestJS

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

Wrapper for [csv-parser library](https://github.com/mafintosh/csv-parser)

## Installation

```bash
$ npm install nest-csv-parser
# or if you using Yarn
$ yarn add nest-csv-parser
```

Add nest-csv-parser as a dependency.

```js
import { Module } from '@nestjs/common'
import { CsvModule } from 'nest-csv-parser'
// ...imports of your app dependecies

@Module({
  imports: [
    CsvModule, // <-- add into imports
    ...
  ],
  controllers: [ ... ],
  providers: [ ... ]
})
export class AppModule {}
```

## Usage

Parser will create instance of entity for each line in CSV stream.

```js
// app.parser.ts
import { Injectable } from '@nestjs/common'
import { CsvParser } from 'nest-csv-parser'

class Entity {
  foo: string
  bar: string
}

@Injectable()
export class AppService {
  constructor(
    private readonly csvParser: CsvParser
  ) {}

  async parse() {
    // Create stream from file (or get it from S3)
    const stream = fs.createReadStream(__dirname + '/some.csv')
    const entities: Entity[] = await csvParser.parse(stream, Entity)

    return entities
  }
}
```

## API

`csvParser.parse(stream, Entity, count, offset, csvConfig)` has 5 parameters.

### stream

required

First parameter has to be the stream of the CSV file. [NodeJS Reference](https://nodejs.org/api/stream.html)

### Entity

required

Has to be object from which will parser create instance.

### count (optional)

default: null

How many lines you want to parse.

### offset (optional)

default: null

Offset is similar to SQL databases. Skips the N lines from the beginning of the file.

### csvConfig (optional)

default

```js
{ strict: true, separator: ';' }
```

Just a configuration object  for [csv-parser library](https://github.com/mafintosh/csv-parser) options you can find [here](https://github.com/mafintosh/csv-parser#api)

## Development

```bash
# clone repository
$ git clone git@github.com:mCzolko/nest-csv-parser.git
$ cd nest-csv-parser

# install dependencies
$ yarn install

# watch mode
$ yarn test:watch
```

## Test

```bash
# unit tests
$ yarn test
```

## Author

Michael Czolko

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/N4N3145WR)
