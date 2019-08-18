import 'reflect-metadata';

const formatMetadataKey = Symbol('CsvKey');

export function CsvKey(name: string) {
  return Reflect.metadata(formatMetadataKey, name);
}

export function getCsvKey(target: any, propertyKey: string) {
  console.log(target, propertyKey, Reflect.getMetadata(formatMetadataKey, target, propertyKey))
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
