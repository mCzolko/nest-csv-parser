import 'reflect-metadata';

const formatMetadataKey = Symbol('CsvKey');

export const CsvKey = (name: string) => (target, property) => {
  const metadata = Reflect.getMetadata(formatMetadataKey, target) || {};
  metadata[name] = property;
  Reflect.defineMetadata(formatMetadataKey, metadata, target);
};

export function getCsvKey(target: any, propertyKey: string) {
  const metadata = Reflect.getMetadata(formatMetadataKey, target) || {};
  return metadata[propertyKey];
}
